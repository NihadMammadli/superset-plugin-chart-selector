import React, { useEffect, useState } from 'react';
import { styled } from '@superset-ui/core';
import { Select } from 'antd';
import { matchSorter } from 'match-sorter';
import { SupersetPluginChartSelectorProps } from './types';

const StyledContainer = styled.div`
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: ${({ theme }) => theme.gridUnit}px !important;
    border-color: ${({ theme }) => theme.colors.grayscale.light2} !important;
  }

  .ant-select-selection-placeholder {
    color: ${({ theme }) => theme.colors.grayscale.light1};
  }

  &.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: ${({ theme }) => theme.colors.primary.base} !important;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.light3};
  }

  .ant-select-selection-item {
    background: ${({ theme }) => theme.colors.primary.light4};
    border-color: ${({ theme }) => theme.colors.primary.light1};
    color: ${({ theme }) => theme.colors.primary.dark1};
  }
`;

const StyledHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.grayscale.dark1};
  font-size: ${({ theme }) => theme.typography.sizes.m}px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

export default function SupersetPluginChartSelector(props: SupersetPluginChartSelectorProps) {
  const {
    data,
    loading,
    enableCrossFiltering = true,
    setDataMask,
    onFilterChange,
    currentState,
    filterState,
    formData,
    headerText,
  } = props;

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const filterColumn = formData?.cols?.[0] || 'id';

  // Process and deduplicate options
  const options = data.map((d: any) => ({
    value: d[filterColumn],
    label: formData?.cols?.map(col => d[col]).join(' - ') || d[filterColumn],
    searchText: formData?.cols?.map(col => d[col]).join(' '), // Used for searching across all columns
  }));

  const uniqueOptions = Array.from(new Map(options.map(item => [item.value, item])).values());

  // Handle initial state and external filter changes
  useEffect(() => {
    // Priority: filterState > currentState > default first value
    if (filterState?.selectedValues) {
      const newValues = filterState.selectedValues;
      if (JSON.stringify(newValues) !== JSON.stringify(selectedValues)) {
        setSelectedValues(newValues);
        if (enableCrossFiltering && setDataMask) {
          emitFilterChange(newValues);
        }
      }
    } else if (currentState?.selectedValues && !selectedValues.length) {
      setSelectedValues(currentState.selectedValues);
    } else if (!selectedValues.length && uniqueOptions.length > 0) {
      // Select first value by default if no other selection exists
      const firstValue = uniqueOptions[0].value;
      setSelectedValues([firstValue]);
      if (enableCrossFiltering) {
        emitFilterChange([firstValue]);
      }
    }
  }, [filterState, currentState, uniqueOptions.length]);

  const emitFilterChange = (values: string[]) => {
    if (!setDataMask) return;

    const dataMask = {
      extraFormData: {
        filters: values.length
          ? [
              {
                col: filterColumn,
                op: 'IN',
                val: values,
              },
            ]
          : [],
      },
      filterState: {
        value: values,
        selectedValues: values,
      },
    };
    setDataMask(dataMask);
  };

  const handleChange = (values: string[]) => {
    setSelectedValues(values);

    if (enableCrossFiltering) {
      emitFilterChange(values);
    }

    if (onFilterChange) {
      onFilterChange(values);
    }
  };

  const filterOption = (input: string, option: any) => {
    if (!input) return true;
    return matchSorter([option], input, { 
      keys: ['label', 'searchText'],
      threshold: matchSorter.rankings.CONTAINS,
    }).length > 0;
  };

  return (
    <StyledContainer>
      {headerText && (
        <StyledHeader>
          {headerText}
        </StyledHeader>
      )}
      <StyledSelect
        style={{ width: '100%' }}
        placeholder="Select values"
        mode="multiple"
        allowClear
        showSearch
        loading={loading}
        value={selectedValues}
        onChange={handleChange}
        options={uniqueOptions}
        filterOption={filterOption}
      />
    </StyledContainer>
  );
}