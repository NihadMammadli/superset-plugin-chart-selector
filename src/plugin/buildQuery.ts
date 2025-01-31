/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { buildQueryContext, QueryFormData, QueryObject } from '@superset-ui/core';

/**
 * The buildQuery function is responsible for building the queries that will fetch the data
 * for your visualization.
 */
export default function buildQuery(formData: QueryFormData) {
  const { 
    cols = [], 
    adhoc_filters = [],
    time_range,
    row_limit = 10, // Set default to 10
    extra_form_data,
  } = formData;

  const searchValue = extra_form_data?.search_value || '';

  // Process adhoc filters
  const processedFilters = adhoc_filters.map((filter: any) => ({
    col: filter.subject,
    op: filter.operator,
    val: filter.comparator,
    ...(filter.expressionType === 'SQL' ? { sqlExpression: filter.sqlExpression } : {}),
  }));

  // Process cross-filters from other charts
  const crossFilters = (extra_form_data?.filters || []).map((filter: any) => ({
    col: filter.col,
    op: filter.op,
    val: filter.val,
  }));

  // Combine both types of filters
  const combinedFilters = [...processedFilters, ...crossFilters];

  return buildQueryContext(formData, (baseQueryObject: QueryObject) => {
    const queryObject = {
      ...baseQueryObject,
      columns: cols,
      filters: combinedFilters,
      time_range: time_range,
      row_limit: row_limit,
      order_desc: true,
      is_timeseries: false,
    };

    // Add search filter if search value is present
    if (searchValue) {
      queryObject.filters = [
        ...(queryObject.filters || []),
        ...cols.map(col => ({
          col,
          op: 'ILIKE',
          val: `%${searchValue}%`,
        })),
      ];
    }

    return [queryObject];
  });
}
