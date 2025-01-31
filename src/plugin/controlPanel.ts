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
import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sharedControls,
  sections,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'cols',
            config: {
              ...sharedControls.groupby,
              label: t('Columns'),
              description: t('Select columns to display in the selector. First column will be used for filtering.'),
              multiple: true,
              required: true,
            },
          },
        ],
        [
          {
            name: 'row_limit',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Row limit'),
              default: 10,
              choices: [
                [10, '10'],
                [25, '25'],
                [50, '50'],
                [100, '100'],
                [500, '500'],
              ],
              description: t('Maximum number of rows to display'),
            },
          },
        ],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Selector Settings'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'headerText',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              label: t('Header Text'),
              description: t('Optional header text above the selector'),
            },
          },
        ],
        [
          {
            name: 'enableCrossFiltering',
            config: {
              type: 'CheckboxControl',
              label: t('Cross-Filtering'),
              default: true,
              renderTrigger: true,
              description: t('Enable cross-filtering with other charts'),
            },
          },
        ],
      ],
    },
  ],
  requiredFields: ['cols'],
};

export default config;
