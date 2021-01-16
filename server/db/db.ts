// tslint:disable:radix

import { Pool, QueryConfig, QueryResult } from 'pg';

const pool = new Pool();

const fns = {
  query: (text: string | QueryConfig<any[]>, params?: any[], log = true): Promise<QueryResult<any>> => {
    const p = new Promise<QueryResult<any>>((resolve, reject) => {
      const d = new Date().getTime();
      if (log) {
        console.log('Execute SQL: ' + text, ' Params: ', params ? params : 'none');
      }
      pool.query(text, params).then((qr) => {
        if (log) {
          console.log('Executed in ' + (new Date().getTime() - d) + 'ms');
        }
        resolve(qr);
      }).catch((err) => reject(err));
    });
    return p;
  }
};

export default fns;