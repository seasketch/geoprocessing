import { clipToGeography } from "./clipToGeography.js";
import project from "../../project/projectClient.js";
import { bbox, area } from "@turf/turf";
import { Polygon, Sketch, genSampleSketch, genSketchCollection } from "@seasketch/geoprocessing";
import { describe, test, expect } from "vitest";

const sketch: Sketch<Polygon> = genSampleSketch<Polygon>(
  {
    type: "Polygon",
    coordinates: [
      [
        [158.22495041364024, 6.9756172204876385],
        [158.225024, 6.975545],
        [158.225225, 6.975253],
        [158.225548, 6.974825],
        [158.225788, 6.97465],
        [158.226185, 6.974247],
        [158.226401, 6.974004],
        [158.226425, 6.973833],
        [158.226513, 6.973556],
        [158.226582, 6.973415],
        [158.226827, 6.973303],
        [158.22692, 6.973056],
        [158.227106, 6.972842],
        [158.22714, 6.972637],
        [158.227449, 6.972647],
        [158.227944, 6.972423],
        [158.228125, 6.972205],
        [158.228478, 6.971694],
        [158.228776, 6.971232],
        [158.228781, 6.971043],
        [158.228713, 6.970819],
        [158.228879, 6.970571],
        [158.229183, 6.970435],
        [158.229486, 6.970177],
        [158.229648, 6.969944],
        [158.229604, 6.969691],
        [158.22979, 6.969584],
        [158.230079, 6.969487],
        [158.230475, 6.969009],
        [158.230441, 6.96873],
        [158.230596, 6.968795],
        [158.231083, 6.968596],
        [158.231687, 6.968534],
        [158.232021, 6.968598],
        [158.232478, 6.968268],
        [158.232462, 6.967888],
        [158.232735, 6.967766],
        [158.233143, 6.967495],
        [158.233266, 6.967444],
        [158.23362, 6.967157],
        [158.233615, 6.967013],
        [158.234117, 6.966861],
        [158.234413, 6.966656],
        [158.234546, 6.966748],
        [158.23479, 6.966164],
        [158.235076, 6.96591],
        [158.235315, 6.965524],
        [158.235803, 6.965135],
        [158.236076, 6.965035],
        [158.236587, 6.964346],
        [158.23675, 6.963959],
        [158.236485, 6.963742],
        [158.236775, 6.963552],
        [158.237632, 6.963268],
        [158.237853, 6.962992],
        [158.237967, 6.962795],
        [158.237941, 6.962677],
        [158.237754, 6.962148],
        [158.237839, 6.961777],
        [158.238039, 6.961523],
        [158.238107, 6.960872],
        [158.238216, 6.960878],
        [158.238329, 6.96072],
        [158.238363, 6.960323],
        [158.238303, 6.960166],
        [158.238408, 6.960126],
        [158.238502, 6.960108],
        [158.238679, 6.96004],
        [158.238924, 6.959892],
        [158.238989, 6.959792],
        [158.239071, 6.959683],
        [158.239058, 6.959578],
        [158.239025, 6.95955],
        [158.239016, 6.9595],
        [158.239078, 6.959498],
        [158.239154, 6.959446],
        [158.239204, 6.959336],
        [158.23929, 6.959202],
        [158.239369, 6.95909],
        [158.239373, 6.959027],
        [158.239481, 6.958898],
        [158.239513, 6.958839],
        [158.239511, 6.958776],
        [158.239554, 6.958702],
        [158.239573, 6.958626],
        [158.239602, 6.958542],
        [158.239624, 6.958411],
        [158.239605, 6.95838],
        [158.239622, 6.958346],
        [158.239623, 6.958233],
        [158.239604, 6.95808],
        [158.23956, 6.957988],
        [158.239566, 6.957929],
        [158.239541, 6.957874],
        [158.239532, 6.957828],
        [158.239506, 6.957775],
        [158.239488, 6.957743],
        [158.239454, 6.957744],
        [158.23945, 6.957685],
        [158.239417, 6.957613],
        [158.239407, 6.957534],
        [158.239368, 6.957475],
        [158.239311, 6.957427],
        [158.239261, 6.957423],
        [158.239181, 6.9573],
        [158.23911, 6.957101],
        [158.239136, 6.957053],
        [158.23909, 6.956939],
        [158.239024, 6.956873],
        [158.238949, 6.956838],
        [158.238888, 6.956844],
        [158.238896, 6.956746],
        [158.238806, 6.956611],
        [158.238802, 6.956553],
        [158.23878, 6.956508],
        [158.238736, 6.956484],
        [158.238726, 6.956369],
        [158.238684, 6.956273],
        [158.238645, 6.956247],
        [158.238615, 6.956121],
        [158.238562, 6.956035],
        [158.238509, 6.955916],
        [158.238447, 6.955889],
        [158.238382, 6.955887],
        [158.238389, 6.955804],
        [158.238417, 6.955752],
        [158.238428, 6.95562],
        [158.238423, 6.955467],
        [158.238411, 6.955366],
        [158.238368, 6.955319],
        [158.238362, 6.955278],
        [158.238444, 6.955252],
        [158.238497, 6.955172],
        [158.238543, 6.955131],
        [158.238548, 6.955086],
        [158.238584, 6.955062],
        [158.238625, 6.954982],
        [158.238626, 6.954922],
        [158.238666, 6.954846],
        [158.238684, 6.954797],
        [158.23869, 6.954744],
        [158.238674, 6.954686],
        [158.238644, 6.954626],
        [158.238619, 6.954625],
        [158.238594, 6.954599],
        [158.238568, 6.954576],
        [158.23856, 6.954542],
        [158.238554, 6.954518],
        [158.23858, 6.954511],
        [158.238628, 6.954592],
        [158.238689, 6.954656],
        [158.238706, 6.954663],
        [158.23872, 6.954679],
        [158.238761, 6.954687],
        [158.238808, 6.954671],
        [158.238852, 6.954666],
        [158.238864, 6.954708],
        [158.238906, 6.954745],
        [158.23893770245004, 6.954760233644836],
        [159.39457010631185, 8.57078874744658],
        [159.34680775999365, 8.614032490174239],
        [158.22495041364024, 6.9756172204876385],
      ],
      [
        [158.244462, 6.992755],
        [158.244629, 6.992846],
        [158.244705, 6.992967],
        [158.244864, 6.993298],
        [158.245146, 6.993977],
        [158.244986, 6.994196],
        [158.244933, 6.994482],
        [158.244956, 6.994777],
        [158.244902, 6.995048],
        [158.244925, 6.995289],
        [158.245024, 6.995659],
        [158.24526, 6.996066],
        [158.24526, 6.996255],
        [158.245184, 6.996353],
        [158.245001, 6.99673],
        [158.244994, 6.997024],
        [158.245039, 6.997552],
        [158.245206, 6.997899],
        [158.245328, 6.998268],
        [158.245541, 6.998653],
        [158.24526, 6.998894],
        [158.245366, 6.999188],
        [158.245533, 6.999384],
        [158.245685, 6.999467],
        [158.245921, 6.999762],
        [158.246012, 6.999973],
        [158.245921, 7.000327],
        [158.245905, 7.000825],
        [158.246065, 7.00087],
        [158.246316, 7.000998],
        [158.246452, 7.001504],
        [158.246589, 7.001715],
        [158.246574, 7.001866],
        [158.246452, 7.002198],
        [158.246528, 7.002341],
        [158.246848, 7.002416],
        [158.247106, 7.002605],
        [158.247152, 7.002922],
        [158.24719, 7.003125],
        [158.247532, 7.003472],
        [158.247235, 7.003442],
        [158.246825, 7.003336],
        [158.246696, 7.003276],
        [158.246392, 7.003065],
        [158.246194, 7.003012],
        [158.246019, 7.002778],
        [158.245951, 7.002665],
        [158.245746, 7.002635],
        [158.245381, 7.002703],
        [158.245222, 7.002922],
        [158.245427, 7.003027],
        [158.245343, 7.003276],
        [158.245465, 7.003449],
        [158.245602, 7.003676],
        [158.245723, 7.004234],
        [158.245723, 7.004505],
        [158.245708, 7.004928],
        [158.245761, 7.005207],
        [158.24589, 7.005561],
        [158.246247, 7.00587],
        [158.24649, 7.006044],
        [158.246924, 7.006308],
        [158.247478, 7.006934],
        [158.247752, 7.007258],
        [158.248162, 7.007409],
        [158.248534, 7.007537],
        [158.248709, 7.007537],
        [158.249142, 7.007658],
        [158.249484, 7.007801],
        [158.249636, 7.007695],
        [158.249811, 7.00756],
        [158.249902, 7.007718],
        [158.249993, 7.008072],
        [158.250221, 7.008299],
        [158.25035, 7.008442],
        [158.250654, 7.008495],
        [158.251087, 7.008472],
        [158.251255, 7.00851],
        [158.251657, 7.008751],
        [158.252068, 7.008751],
        [158.252258, 7.008668],
        [158.252303, 7.008766],
        [158.252349, 7.008992],
        [158.252432, 7.009286],
        [158.252577, 7.009558],
        [158.252759, 7.009777],
        [158.25304, 7.00998],
        [158.253422, 7.010343],
        [158.253574, 7.01045],
        [158.25368, 7.010601],
        [158.253844, 7.010725],
        [158.254204, 7.010896],
        [158.254545, 7.011162],
        [158.254878, 7.011225],
        [158.255197, 7.011301],
        [158.255485, 7.011506],
        [158.255682, 7.011123],
        [158.255811, 7.010712],
        [158.256009, 7.010552],
        [158.256008, 7.010262],
        [158.256209, 7.010026],
        [158.256406, 7.009799],
        [158.256444, 7.009603],
        [158.256429, 7.009324],
        [158.256482, 7.009113],
        [158.256657, 7.008774],
        [158.256672, 7.008691],
        [158.256778, 7.008344],
        [158.257029, 7.008178],
        [158.257067, 7.00808],
        [158.257196, 7.00759],
        [158.257364, 7.007431],
        [158.257424, 7.007213],
        [158.25763, 7.007115],
        [158.25785, 7.006911],
        [158.257819, 7.006654],
        [158.257979, 7.006391],
        [158.257971, 7.006074],
        [158.257994, 7.005772],
        [158.257944, 7.005394],
        [158.258303, 7.005229],
        [158.258373, 7.005085],
        [158.258293, 7.004867],
        [158.258334, 7.004679],
        [158.258416, 7.004111],
        [158.258277, 7.003988],
        [158.258309, 7.003829],
        [158.258357, 7.003887],
        [158.258663, 7.003706],
        [158.25877, 7.003254],
        [158.258936, 7.0023],
        [158.258695, 7.002189],
        [158.258545, 7.002247],
        [158.258325, 7.002284],
        [158.258362, 7.002119],
        [158.258663, 7.001997],
        [158.258969, 7.001954],
        [158.25899, 7.001667],
        [158.259054, 7.00123],
        [158.258915, 7.000842],
        [158.258831, 7.000126],
        [158.258625, 6.999723],
        [158.258467, 6.999385],
        [158.258423, 6.999292],
        [158.258461, 6.999142],
        [158.258498, 6.99902],
        [158.258364, 6.998876],
        [158.258214, 6.998689],
        [158.258079, 6.998492],
        [158.257596, 6.998081],
        [158.257418, 6.997958],
        [158.257214, 6.997894],
        [158.256967, 6.997772],
        [158.256844, 6.997574],
        [158.256817, 6.997414],
        [158.256446, 6.996993],
        [158.25621, 6.996993],
        [158.256022, 6.997132],
        [158.255989, 6.996961],
        [158.255882, 6.996759],
        [158.255651, 6.996615],
        [158.255463, 6.996529],
        [158.25528, 6.996513],
        [158.254995, 6.996663],
        [158.25477, 6.996743],
        [158.254437, 6.996753],
        [158.254227, 6.996743],
        [158.254098, 6.996689],
        [158.253894, 6.996876],
        [158.253856, 6.997057],
        [158.253985, 6.997142],
        [158.25427, 6.997174],
        [158.254265, 6.997356],
        [158.254184, 6.997649],
        [158.254136, 6.998001],
        [158.254146, 6.998145],
        [158.254222, 6.998326],
        [158.254378, 6.998529],
        [158.254367, 6.998826],
        [158.253798, 6.998789],
        [158.25357, 6.998485],
        [158.253134, 6.998297],
        [158.25326, 6.99811],
        [158.25342, 6.998057],
        [158.253458, 6.997921],
        [158.25339, 6.99762],
        [158.253207, 6.997318],
        [158.252995, 6.997182],
        [158.252782, 6.997092],
        [158.252516, 6.996979],
        [158.251893, 6.996873],
        [158.251566, 6.996926],
        [158.251323, 6.996783],
        [158.25108, 6.996624],
        [158.250814, 6.996451],
        [158.250844, 6.996194],
        [158.250784, 6.995953],
        [158.250556, 6.995727],
        [158.250153, 6.995576],
        [158.24994, 6.99544],
        [158.249667, 6.995252],
        [158.249461, 6.995161],
        [158.249279, 6.995101],
        [158.24899, 6.995139],
        [158.248873, 6.995033],
        [158.248841, 6.9949],
        [158.248937, 6.994837],
        [158.249127, 6.994799],
        [158.249241, 6.994701],
        [158.24937, 6.994513],
        [158.249499, 6.994301],
        [158.249553, 6.994045],
        [158.249553, 6.993856],
        [158.249499, 6.993585],
        [158.249401, 6.993253],
        [158.249317, 6.992899],
        [158.249408, 6.992657],
        [158.249401, 6.992182],
        [158.249332, 6.992016],
        [158.249218, 6.99176],
        [158.249211, 6.991602],
        [158.249211, 6.991413],
        [158.249097, 6.991134],
        [158.24922, 6.990986],
        [158.249311, 6.990747],
        [158.249273, 6.990478],
        [158.249188, 6.990372],
        [158.249112, 6.990312],
        [158.248926, 6.990338],
        [158.248848, 6.990165],
        [158.248656, 6.990056],
        [158.248709, 6.989905],
        [158.248709, 6.989603],
        [158.24861, 6.989467],
        [158.248291, 6.989286],
        [158.248223, 6.989218],
        [158.248086, 6.98915],
        [158.247942, 6.989015],
        [158.24779, 6.988917],
        [158.247592, 6.988894],
        [158.247357, 6.989203],
        [158.24722, 6.989384],
        [158.246931, 6.989497],
        [158.246817, 6.989633],
        [158.246764, 6.989814],
        [158.246665, 6.98992],
        [158.24643, 6.990063],
        [158.246095, 6.990161],
        [158.245989, 6.990312],
        [158.245959, 6.990598],
        [158.245845, 6.990908],
        [158.2457, 6.991096],
        [158.245389, 6.99124],
        [158.245222, 6.991353],
        [158.244956, 6.99182],
        [158.244788, 6.991994],
        [158.244735, 6.992212],
        [158.24472, 6.992371],
        [158.244599, 6.992559],
        [158.244462, 6.992755],
      ],
      [
        [158.245541, 6.990086],
        [158.245594, 6.990236],
        [158.24567, 6.990334],
        [158.24586, 6.990274],
        [158.245966, 6.990138],
        [158.246027, 6.99001],
        [158.246057, 6.989897],
        [158.245959, 6.989799],
        [158.245754, 6.989784],
        [158.245655, 6.989859],
        [158.245541, 6.990086],
      ],
    ],
  },
  "foo"
);

const noOverlapSketch = genSampleSketch<Polygon>({
  type: "Polygon",
  coordinates: [
    [
      [181, 181],
      [181, 182],
      [182, 182],
      [182, 181],
      [181, 181],
    ]
  ],
});

describe("clipToGeography", () => {
  test("clipToGeography - with world polygon should not change the polygon", async () => {
    const curGeography = project.getGeographyById("world");
    const sketchArea = area(sketch);
    const sketchBox = sketch.bbox || bbox(sketch);
    const clippedSketch = await clipToGeography(sketch, curGeography);
    const clippedSketchArea = area(clippedSketch);
    const clippedSketchBox = clippedSketch.bbox || bbox(clippedSketch);
    expect(clippedSketchArea).toEqual(sketchArea);
    expect(sketchBox).toEqual(clippedSketchBox);
  });

  test("clipToGeography - no overlap", async () => {
    const curGeography = project.getGeographyById("world");
    const sketchArea = area(noOverlapSketch);

    const clippedSketch = await clipToGeography(noOverlapSketch, curGeography);
    const clippedSketchArea = area(clippedSketch);
    const clippedSketchBox = clippedSketch.bbox || bbox(clippedSketch);

    // Clipped sketch should be zero-ed
    expect(sketchArea === clippedSketchArea).toBe(false);
    expect(clippedSketchArea).toEqual(0);
    expect(clippedSketchBox.every((v)=> v===0)).toBe(true);
  });

  test("clipToGeography - sketch collection", async () => {
    // Sketch collection with overlapping and non-overlapping polygons
    const curGeography = project.getGeographyById("world");
    const sketchArea = area(sketch);
    const sketchBox = sketch.bbox || bbox(sketch);

    const sketchCollection = genSketchCollection([sketch, noOverlapSketch])
    const clippedSketchCollection = await clipToGeography(sketchCollection, curGeography);
    const clippedSketchCollectionArea = area(clippedSketchCollection);
    const clippedSketchCollectionBox = clippedSketchCollection.bbox || bbox(clippedSketchCollection);

    expect(sketchArea === clippedSketchCollectionArea).toBe(true);
    sketchBox.forEach((bboxCoord, i) => expect(bboxCoord).toBeCloseTo(clippedSketchCollectionBox[i]));
  });
});

