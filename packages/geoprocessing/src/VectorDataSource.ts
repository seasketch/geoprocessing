import Flatbush from "flatbush";
import Pbf from "pbf";
import geobuf from "geobuf";
import LRUCache from "mnemonist/lru-cache";
import {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  BBox,
} from "geojson";
import RBush from "rbush";
import bbox from "@turf/bbox";
import isHostedOnLambda from "./isHostedOnLambda";
import "./fetchPolyfill";

// import { recombineTree } from "./recombine";

export interface VectorFeature extends Feature<Polygon | MultiPolygon> {
  // always set by VectorDataSource
  bbox: BBox;
}

const getBBox = (feature: Feature) => {
  return feature.bbox || bbox(feature);
};

interface VectorDataSourceDetails {
  options: VectorDataSourceOptions;
  url: string;
}

let sources: VectorDataSourceDetails[] = [];

// const debug = require("debug")("VectorDataSource");

export interface VectorDataSourceOptions {
  /**
   * Max number of feature bundles to keep in memory.
   * Calls to .fetch() will not return more than the contents these bundles, so
   * this acts as an effective limit on subsequent analysis.
   * @type {number}
   * @default 250
   * @memberof VectorDataSourceOptions
   */
  cacheSize: number;

  /**
   * Source will only preload bundles when the bounding box provided to hint()
   * contains less than hintPrefetchLimit bundles.
   * @type {number}
   * @default 8
   * @memberof VectorDataSourceOptions
   */
  hintPrefetchLimit: number;
  /**
   * When features are requested by fetch, bundled features with matching
   * union_id will be dissolved into a single feature. This dissolved feature is
   * expensive to create and so may be cached. A cache may contain more bundles
   * than needed, and this variable sets a cap on that number.
   *
   * @type {number}
   * @default 3
   * @memberof VectorDataSourceOptions
   */
  dissolvedFeatureCacheExcessLimit: number;
}

export const DEFAULTS: VectorDataSourceOptions = {
  cacheSize: 250,
  hintPrefetchLimit: 8,
  dissolvedFeatureCacheExcessLimit: 3,
};

interface DataSourceMetadata {
  name: string;
  project: string;
  homepage: string;
  version: number;
  description: string;
  index: IndexSource;
  compositeIndexes: CompositeIndexSource[];
}

interface IndexSource {
  length: number;
  bytes: number;
  location: string;
  rootDir: string;
}

interface CompositeIndexSource extends IndexSource {
  bbox: BBox;
  offset: number;
}

interface PendingRequest {
  promise: Promise<any>;
  abortController: AbortController;
  priority: "low" | "high";
}

interface DissolvedFeatureCache {
  feature: Feature<Polygon | MultiPolygon>;
  bundleIds: { [key: string]: Boolean };
}

export interface FeatureTree {
  fid: Number;
  root: Node;
}

export interface Node {
  nodeId: Number;
  leaf?: VectorFeature;
  ancestors: number[];
  cutline?: number;
  children?: Node[];
}

class RBushIndex extends RBush<Feature> {
  toBBox(feature: Feature) {
    const [minX, minY, maxX, maxY] = feature.bbox!;
    return { minX, minY, maxX, maxY };
  }
  compareMinX(a: Feature, b: Feature) {
    return a.bbox![0] - b.bbox![0];
  }
  compareMinY(a: Feature, b: Feature) {
    return a.bbox![1] - b.bbox![1];
  }
}

export class VectorDataSource<T> {
  options: VectorDataSourceOptions;
  metadata?: DataSourceMetadata;
  private url: string;
  private initPromise?: Promise<void>;
  private initError?: Error;
  private bundleIndex?: Flatbush;
  private pendingRequests: Map<string, PendingRequest>;
  private cache: LRUCache<number, FeatureCollection>;
  private tree: RBushIndex;
  private dissolvedFeatureCache?: DissolvedFeatureCache;
  private needsRewinding?: boolean;

  /**
   * VectorDataSource aids client-side or lambda based geoprocessing tools fetch
   * data from binned static vector sources generated by @seasketch/datasources
   * commands.
   *
   * @param {string} url
   * @param {VectorDataSourceOptions} options
   * @memberof VectorDataSource
   */
  constructor(url: string, options: Partial<VectorDataSourceOptions> = {}) {
    this.options = { ...DEFAULTS, ...options };
    this.url = url.replace(/\/$/, "");
    this.pendingRequests = new Map();
    this.cache = new LRUCache(Uint32Array, Array, this.options.cacheSize);
    this.tree = new RBushIndex();
    sources.push({
      url: this.url,
      options: this.options,
    });
    this.fetchMetadata();
  }

  static clearRegisteredSources() {
    sources = [];
  }

  static getRegisteredSources() {
    return sources;
  }

  private async fetchMetadata() {
    if (this.metadata && this.bundleIndex) {
      return;
    } else {
      delete this.initError;
      const metadataUrl = this.url + "/metadata.json";
      return fetch(metadataUrl)
        .then((r) =>
          r.json().then(async (metadata: DataSourceMetadata) => {
            this.metadata = metadata;
            await this.fetchBundleIndex();
            return;
          })
        )
        .catch((e) => {
          // It's easier to deal with these errors at the point of use later,
          // rather than as a side-effect of instantiation. Otherwise it's easy
          // to run into unhandled promise exceptions or rejections
          // The identifyBundles method will check for initError
          console.error(e);
          this.initError = new Error(
            `Problem fetching VectorDataSource manifest from ${metadataUrl}`
          );
        });
    }
  }

  private async fetchBundleIndex(): Promise<Flatbush> {
    // for now, prefer the entire index
    if (this.bundleIndex) {
      return this.bundleIndex;
    }
    if (!this.metadata) {
      throw new Error("Metadata not yet fetched");
    }
    const i = this.metadata.index;
    if (!i) {
      throw new Error(`Expected "entire" index not found in manifest`);
    }
    let data;
    try {
      const response = await fetch(this.url + i.location);
      data = await response.arrayBuffer();
    } catch (e) {
      console.error(e);
      throw new Error(
        `Problem fetching or parsing index data at ${i.location}`
      );
    }
    this.bundleIndex = Flatbush.from(data);
    return this.bundleIndex;
  }

  private async identifyBundles(bbox: BBox) {
    await this.fetchMetadata();
    // It's easier to deal with these errors at the point of use, rather than
    // as a side-effect of instantiation. Otherwise it's easy to run into
    // unhandled promise exceptions or rejections
    if (this.initError) {
      throw this.initError;
    }
    // this will have to be more complex to accomadate nested indicies
    return this.bundleIndex!.search(bbox[0], bbox[1], bbox[2], bbox[3]);
  }

  async fetchBundle(
    id: number,
    priority: "low" | "high" = "low"
  ): Promise<FeatureCollection> {
    const key = id.toString();
    const existingRequest = this.pendingRequests.get(key);
    const bundle = this.cache.get(id);
    if (bundle) {
      // debug(`Found bundle ${id}.proto in cache`);
      return bundle;
    } else if (existingRequest) {
      // debug(`Found bundle ${id}.proto request in progress`);
      return existingRequest.promise;
      // already fetched and processed bundle
      // return Promise.resolve("existing features");
    } else {
      // start fetching and processing
      const url = `${this.url}${this.metadata?.index.rootDir}/${id}.pbf`;
      // debug(`Fetching bundle ${url}`);
      const abortController = new AbortController();
      const promise: Promise<any> = fetch(url, {
        signal: abortController.signal,
      })
        .then((r) => {
          if (abortController.signal.aborted) {
            return Promise.reject(new DOMException("Aborted", "AbortError"));
          }
          if (!r.ok) {
            this.pendingRequests.delete(key);
            return Promise.reject(
              new Error(`Problem fetching datasource bundle at ${url}`)
            );
          }
          return r.arrayBuffer();
        })
        .then((arrayBuffer) => {
          if (abortController.signal.aborted) {
            return Promise.reject(new DOMException("Aborted", "AbortError"));
          }
          const geojson = geobuf.decode(
            new Pbf(arrayBuffer)
          ) as FeatureCollection;
          // if (this.needsRewinding === undefined) {
          //   let ring: Position[];
          //   if (geojson.features[0].geometry.type === "MultiPolygon") {
          //     ring = geojson.features[0].geometry.coordinates[0][0];
          //   } else if (geojson.features[0].geometry.type === "Polygon") {
          //     ring = geojson.features[0].geometry.coordinates[0];
          //   }
          //   this.needsRewinding = geojsonArea.ring(ring!) >= 0;
          // }
          // add to bundle cache
          const popped = this.cache.setpop(id, geojson);
          if (popped && popped.evicted) {
            // debug(`Evicting ${popped.key}.proto from cache.`);
            this.removeFeaturesFromIndex(popped.value.features);
          }
          // add individual features to spatial index
          // debug(`Adding features from ${key}.proto to spatial index`);
          for (const feature of geojson.features) {
            if (!feature.bbox) {
              feature.bbox = getBBox(feature);
            }
            feature.properties = feature.properties || {};
            feature.properties._url = url;
            this.tree.insert(feature);
          }
          this.pendingRequests.delete(key);
          return geojson;
        })
        .finally(() => {
          // Make sure this is always run
          this.pendingRequests.delete(key);
        })
        .catch((err) => {
          this.pendingRequests.delete(key);
          if (err.name === "AbortError") {
            // do nothing. fetch aborted
          } else {
            throw err;
          }
        });
      this.pendingRequests.set(key, {
        abortController,
        promise,
        priority,
      });
      return promise;
    }
  }

  private async removeFeaturesFromIndex(features: Array<Feature>) {
    for (const feature of features) {
      this.tree.remove(feature);
    }
  }

  async clear() {
    this.tree.clear();
    for (const key of this.pendingRequests.keys()) {
      const { abortController } = this.pendingRequests.get(key)!;
      abortController.abort();
      this.pendingRequests.delete(key);
    }
    this.cache.clear();
  }

  private cancelLowPriorityRequests(ignore: Array<number>) {
    for (const key of this.pendingRequests.keys()) {
      if (ignore.indexOf(parseInt(key)) === -1) {
        const { abortController, priority } = this.pendingRequests.get(key)!;
        if (priority === "low") {
          // debug(`Cancelling reqest for ${key}.proto`);
          abortController.abort();
          this.pendingRequests.delete(key);
        }
      }
    }
  }

  /**
   * Triggers downloading of indexes and bundles for the defined extent. Bundle
   * data will only be downloaded if the number of bundles within the extent is
   * less than options.hintPrefetchLimit.
   *
   * An ideal use-case for this method is to update the datasource whenever a
   * user pans a web map in anticipation of using this source.
   *
   * @param {number} xmin
   * @param {number} ymin
   * @param {number} xmax
   * @param {number} ymax
   * @returns {Promise<void>} Resolves when all requests are complete
   * @memberof VectorDataSource
   */
  async hint(bbox: BBox): Promise<void> {
    // TODO: fetch any indexes needed if using nested indexes
    // this.prefetchIndicies(xmin, ymin, xmax, ymax);
    const bundleIds = await this.identifyBundles(bbox);
    this.cancelLowPriorityRequests(bundleIds);
    if (bundleIds.length <= this.options.hintPrefetchLimit) {
      // debug(`hint() identified ${bundleIds.length} bundles`);
      return Promise.all(bundleIds.map((id) => this.fetchBundle(id))).then(
        () => {
          return;
        }
      );
    } else {
      // debug(`hint() identified no bundles`);
      Promise.resolve();
    }
  }

  /**
   * Prefetch bundles for the given extent. If a Feature is provided, those
   * bundles that overlap will be prioritized for download first.
   *
   * This operation is *not* effected by `hintPrefetchLimit`. It's best used in
   * situations where the datasource will be used for analysis in the immediate
   * future. For example, when a user has started to draw a feature of interest
   * which will be overlaid.
   *
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @param {Feature} [feature]
   * @returns {Promise<void>}
   * @memberof VectorDataSource
   */
  async prefetch(bbox: BBox, feature?: Feature): Promise<void> {
    // TODO: fetch any indexes needed if using nested indexes
    // this.prefetchIndicies(xmin, ymin, xmax, ymax);
    let bundleIds = await this.identifyBundles(bbox);
    if (feature) {
      // Start with overlapping bundles, then ids of all other bundles in the
      // extent
      const overlapping = await this.identifyBundles(getBBox(feature));
      for (const id of bundleIds) {
        if (overlapping.indexOf(id) === -1) {
          overlapping.push(id);
        }
      }
      bundleIds = overlapping;
    }
    this.cancelLowPriorityRequests(bundleIds);
    return Promise.all(
      bundleIds
        .slice(0, this.options.cacheSize)
        .map((id) => this.fetchBundle(id))
    ).then(() => {
      const features = this.tree.search({
        minX: bbox[0],
        minY: bbox[1],
        maxX: bbox[2],
        maxY: bbox[3],
      });
      // this.preprocess(features);
      return;
    });
  }

  async fetch(bbox: BBox, unionSubdividedFeatures = true): Promise<T[]> {
    // debug(`fetch call ${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}`);
    let bundleIds = await this.identifyBundles(bbox);
    this.cancelLowPriorityRequests(bundleIds);
    if (isHostedOnLambda) {
      console.time(`Fetch ${bundleIds.length} bundles from ${this.url}`);
    }
    await Promise.all(
      bundleIds
        .slice(0, this.options.cacheSize)
        .map((id) => this.fetchBundle(id, "high"))
    );
    if (isHostedOnLambda) {
      console.timeEnd(`Fetch ${bundleIds.length} bundles from ${this.url}`);
    }
    // console.time("retrieval and processing");
    // debug(`Searching index`, bbox);

    let features = (this.tree.search({
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
    }) as unknown) as T[];

    // overlap test since bundles sometimes aren't entirely well packed
    const a = bbox;
    return features.filter((feature) => {
      const b = bbox;
      return a[2] >= b[0] && b[2] >= a[0] && a[3] >= b[1] && b[3] >= a[1];
    });

    // debug(`${[...this.pendingRequests.keys()].length} pending requests`);
    // let trees = undefined;
    // const collection = {
    //   type: "FeatureCollection",
    //   features
    // } as FeatureCollection;
    // if (unionSubdividedFeatures) {
    //   const subdividedFeatures = [];
    //   const smallFeatures = [];
    //   for (const feature of features) {
    //     if (feature.properties && feature.properties._ancestors) {
    //       subdividedFeatures.push(feature);
    //     } else {
    //       smallFeatures.push(feature);
    //     }
    //   }
    //   trees = this.buildTrees(subdividedFeatures);
    //   console.timeEnd("fetch");
    //   // trees.map(tree => recombineTree(tree));
    //   console.time("recombine");
    //   collection.features = [
    //     ...smallFeatures,
    //     ...trees.map(tree => recombineTree(tree, this.needsRewinding))
    //   ];
    //   console.timeEnd("recombine");
    // }
    // console.log(JSON.stringify(collection));
    // console.timeEnd("retrieval and processing");
    // fs.writeFileSync(
    //   "/Users/cburt/Downloads/output2.json",
    //   JSON.stringify({ collection, trees })
    // );
    // fs.writeFileSync("./output/output.geojson", JSON.stringify(collection));
    // return features;
  }

  private buildTrees(features: Feature[]): FeatureTree[] {
    // console.time("buildTrees");
    const trees: FeatureTree[] = [];
    const featuresById: { [key: number]: Feature[] } = {};
    // Group features by _id. Each subdivided feature needs it's own tree
    for (const feature of features) {
      if (
        feature.properties &&
        feature.properties._ancestors &&
        feature.properties._id
      ) {
        if (!(feature.properties._id in featuresById)) {
          featuresById[feature.properties._id] = [];
        }
        featuresById[feature.properties._id].push(feature);
      }
    }
    let nodeId = 0;
    for (const _id in featuresById) {
      const features = featuresById[_id];
      const nodes: Node[] = features.map((f) => {
        return {
          nodeId: nodeId++,
          leaf: f as VectorFeature,
          ancestors: (f.properties ? f.properties._ancestors || "" : "")
            .split(",")
            .map((a: string) => parseFloat(a))
            .reverse(),
        };
      });
      trees.push({
        fid: parseInt(_id),
        root: this.createAncestors(nodes).children![0],
      });
    }
    // console.timeEnd("buildTrees");
    return trees;
  }

  private createAncestors(nodes: Node[]): Node {
    let nodeId = 0;
    // Get node ancestors and sort by deepness
    nodes.sort((a, b) => b.ancestors.length - a.ancestors.length).reverse();

    const populateChildren = (node: Node, children: Node[]) => {
      if (children.length === 0) {
        return node;
      }
      children.sort((a, b) => a.ancestors[0] - b.ancestors[0]);
      // group children by their next ancestor
      const groups: { [key: string]: Node[] } = {};
      for (const child of children) {
        const key = (child.ancestors[0] || "").toString();
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(child);
      }
      // for each group, push a new node onto the node's children
      for (const key in groups) {
        const cutline = groups[key][0].ancestors[0];
        groups[key].forEach((n) => (n.ancestors = n.ancestors.slice(1)));
        if (cutline) {
          (node.children as Node[]).push(
            populateChildren(
              {
                nodeId: nodeId++,
                cutline,
                ancestors: [...node.ancestors, cutline],
                children: [],
              },
              groups[key]
            )
          );
        } else {
          (node.children as Node[]) = groups[key].map((n) => ({
            nodeId: nodeId++,
            leaf: n.leaf,
            ancestors: node.ancestors,
          }));
        }
      }
      return node;
    };

    let rootNode = {
      cutline: nodes[0].ancestors[0],
      children: [],
      ancestors: [],
      nodeId: nodeId++,
    };

    populateChildren(rootNode, nodes);

    const pruneSingleNodedChildren = (root: Node) => {
      for (const child of root.children || []) {
        pruneSingleNodedChildren(child);
      }
      if (root.children && root.children.length === 1) {
        root.cutline = root.children[0].cutline;
        root.children = root.children[0].children;
      }
    };
    for (const child of rootNode.children) {
      pruneSingleNodedChildren(child);
    }
    // pruneSingleNodedChildren(rootNode);
    return rootNode;
  }

  async fetchOverlapping(feature: Feature) {
    return this.fetch(getBBox(feature));
  }
}
