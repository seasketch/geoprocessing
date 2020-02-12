import React from 'react';
import { ResultsCard, SketchAttributesCard } from '@seasketch/geoprocessing';
import { AreaResults } from '../functions/area';

const Number = new Intl.NumberFormat('en', { style: 'decimal'});
const formatAsKm = (meters:number): string => {
  return Number.format(Math.round(meters / (1000 ** 2)));
}

const SimpleReportClient = () => {
  return <>
    <SketchAttributesCard />
    <ResultsCard<AreaResults> title="Zone Size" functionName="area">
      {(data) => <p>
        This feature is <b>{formatAsKm(data.area)}</b> square kilometers.
      </p>}
    </ResultsCard>
  </>
}

export default SimpleReportClient;