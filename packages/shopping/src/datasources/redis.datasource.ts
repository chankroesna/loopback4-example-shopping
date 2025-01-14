// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, lifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
const config = require('./redis.datasource.json');

function updateConfig(dsConfig: AnyObject) {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    dsConfig.host = process.env.SHOPPING_APP_REDIS_MASTER_SERVICE_HOST;
    dsConfig.port = +process.env.SHOPPING_APP_REDIS_MASTER_SERVICE_PORT!;
  }
  return dsConfig;
}

@lifeCycleObserver('datasource')
export class RedisDataSource extends juggler.DataSource {
  static dataSourceName = 'redis';

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(updateConfig(dsConfig));
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
