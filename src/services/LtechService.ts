import axios from 'axios';

const ltechRequest = async (endpoint = [''], method: string = 'get', payload: any = undefined): Promise<any> => {
  // let url = process.env.LETCH_APIURL + endpoint.join('/');
  let encodedKey = new Buffer(process.env.LTECH_APIKEY!).toString('base64');
  
  let response = await axios.request({
    baseURL: process.env.LETCH_APIURL,
    url: endpoint.join('/'),
    method: method,
    headers: {
      'Authorization': 'Basic ' + encodedKey,
      'Content-Type': 'application/json'
    },
    data: payload,
    responseType: 'json',
  }).catch(error => {
    console.log('Lotto service is down');
    return false;
  });

  return typeof response !== 'boolean' ? response.data : response;
}

export const getAccounts = (): Promise<any> => {
  return ltechRequest(['account']);
}

export const getDraws = (): Promise<any> => {
  return ltechRequest(['draws']);
}

/**
 * 
 * @param id 
 * @returns 
 */
export const getDrawsByLottery = (id: number): Promise<any> => {
  return ltechRequest(['draws', id.toString()]);
}

/**
 * 
 * @param lotteryId 
 * @param date 
 * @returns 
 */
export const getDrawsByLotteryByDate = (lotteryId: number, date: string): Promise<any> => {
  return ltechRequest(['draws', lotteryId.toString(), date]);
}

/**
 * 
 * @param payload 
 * @returns 
 */
export const postOrderedTicket = (payload: any): Promise<any> => {
  return ltechRequest(['tickets'], 'post', payload);
}

/**
 * 
 * @param ticketId 
 * @returns 
 */
export const getOrderedTicket = (ticketId: string): Promise<any> => {
  return ltechRequest(['tickets', ticketId.toString()]);
}