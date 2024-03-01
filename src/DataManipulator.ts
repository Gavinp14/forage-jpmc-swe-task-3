import { ServerRespond } from './DataStreamer';

export interface Row {
  timestamp: Date,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1.05; // Adjust as per historical average ratio
    const lowerBound = 0.95; // Adjust as per historical average ratio
    const trigger_alert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;

    return {
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert,
    };
  }
}
