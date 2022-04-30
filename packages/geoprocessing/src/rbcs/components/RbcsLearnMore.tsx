import React from "react";
import { ObjectiveGroup } from "../../types/objective";
import { getMinYesCountMap, getKeys } from "../../helpers";
import {
  rbcsAnchoringActivities,
  rbcsAquacultureActivities,
  rbcsGearTypes,
} from "../rbcs";

export interface RbcsLearnMoreProps {
  objectives: ObjectiveGroup;
}

/**
 * Describes RBCS and lists minimum level of protection required for each objective
 */
export const RbcsLearnMore: React.FunctionComponent<RbcsLearnMoreProps> = ({
  objectives,
}) => {
  const minYesCounts = getMinYesCountMap(objectives);
  return (
    <>
      <p>
        An MPA counts toward an objective if it meets the minimum level of
        protection for that objective.
      </p>
      <table>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Minimum MPA Classification Required</th>
          </tr>
        </thead>
        <tbody>
          {getKeys(objectives).map((objectiveId, index) => {
            return (
              <tr key={index}>
                <td>{objectives[objectiveId].shortDesc}</td>
                <td>{minYesCounts[objectiveId]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        To increase the classification of an MPA in your plan such that it
        counts toward an objective, you must change the allowed activities for
        the MPA to reduce the impact to a level acceptable for the
        classification you want to achieve.
      </p>
      <p>
        {" "}
        A classification is assigned to each MPA based on 1) the number of
        fishing gears allowed, 2) the highest impact fishing gear and 3) the
        impact of allowed aquaculture/bottom exploitation. For no-take, a fourth
        criteria is added, the impact of allowed boating/anchoring. The higher
        the impact of the allowed uses in a given MPA or Zone, the lower the
        classification.
      </p>

      <b>Zone Classification</b>
      <p>
        Zones are assigned 1 of 8 <em>classifications</em> based on the
        activities allowed in that Zone. The classification is assigned based on
        4 criteria:
      </p>
      <ol>
        <li>Number of fishing gear types</li>
        <li>Fishing gear impact</li>
        <li>Allowed aquaculture / bottom exploitation</li>
        <li>Allowed boating / anchoring</li>
      </ol>
      <p>
        If you only have the option to create MPAs for this SeaSketch project
        and not Zones, your MPAs are scored as having a single Zone with the
        activities of the MPA.
      </p>
      <p>Zones are classified based on the following decision tree:</p>
      <p>
        <img
          src={require("../assets/img/zone_classification.png")}
          style={{ maxWidth: "100%" }}
        />
        <a
          target="_blank"
          href="https://www.sciencedirect.com/science/article/pii/S0308597X16300197"
        >
          image source
        </a>
      </p>
      <p>The impact score for each allowed activity is as follows:</p>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Impact score</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rbcsGearTypes).map((gearType, index) => {
            return (
              <tr key={index}>
                <td>{gearType}</td>
                <td>{rbcsGearTypes[gearType]}</td>
              </tr>
            );
          })}
          {Object.keys(rbcsAquacultureActivities).map(
            (aquacultureActivity, index) => {
              return (
                <tr key={index}>
                  <td>{aquacultureActivity}</td>
                  <td>{rbcsAquacultureActivities[aquacultureActivity]}</td>
                </tr>
              );
            }
          )}
          {Object.keys(rbcsAnchoringActivities).map(
            (anchoringActivity, index) => {
              return (
                <tr key={index}>
                  <td>{anchoringActivity}</td>
                  <td>{rbcsAnchoringActivities[anchoringActivity]}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <b>MPA Classification</b>
      <p>
        An MPA is assigned 1 of 5 <em>classifications</em>. The classification
        is based on an index score calculated for the MPA, which is a
        combination of the Zone scores for each MPA, and the size of those Zones
        relative to each other. The larger the area of a Zone relative to the
        others in the MPA, the more weight its impact carries in the MPA index
        score.
      </p>
      <p>
        Note again that if this SeaSketch Project does not allow you to create
        Zones, then each of your MPAs will be scored as having a single Zone
        with the activities of the MPA.
      </p>
      <p>
        <img
          src={require("../assets/img/mpa_classification.png")}
          style={{ maxWidth: "100%" }}
        />
        (
        <a
          target="_blank"
          href="https://www.sciencedirect.com/science/article/pii/S0308597X16300197"
        >
          image source
        </a>
        )
      </p>
      <p>
        This system of assigning protection based on perceived impact is called
        the{" "}
        <a target="_blank" href="https://doi.org/10.1016/j.marpol.2016.06.021">
          regulation-based classification system
        </a>
        (RBCS). To learn more, please read the original published research
        paper:
      </p>
      <p>
        Bárbara Horta e Costa, Joachim Claudet, Gustavo Franco, Karim Erzini,
        Anthony Caro, Emanuel J. Gonçalves, A regulation-based classification
        system for Marine Protected Areas (MPAs), Marine Policy, Volume 72,
        2016, Pages 192-198, ISSN 0308-597X.
        https://doi.org/10.1016/j.marpol.2016.06.021
      </p>
    </>
  );
};
