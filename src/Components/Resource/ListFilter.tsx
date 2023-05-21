import React, { useEffect, useState } from "react";
import { FacilitySelect } from "../Common/FacilitySelect";
import { LegacySelectField } from "../Common/HelperInputFields";
import { RESOURCE_FILTER_ORDER } from "../../Common/constants";
import moment from "moment";
import { getAnyFacility } from "../../Redux/actions";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import { RESOURCE_CHOICES } from "../../Common/constants";
import { DateRangePicker, getDate } from "../Common/DateRangePicker";
import useMergeState from "../../Common/hooks/useMergeState";
import { navigate } from "raviger";
import FiltersSlideover from "../../CAREUI/interactive/FiltersSlideover";
import { FieldLabel } from "../Form/FormFields/FormField";
const resourceStatusOptions = RESOURCE_CHOICES.map((obj) => obj.text);

const clearFilterState = {
  origin_facility: "",
  origin_facility_ref: "",
  approving_facility: "",
  approving_facility_ref: "",
  assigned_facility: "",
  assigned_facility_ref: "",
  emergency: "",
  created_date_before: "",
  created_date_after: "",
  modified_date_before: "",
  modified_date_after: "",
  ordering: "",
  status: "",
};

export default function ListFilter(props: any) {
  const { filter, onChange, closeFilter } = props;
  const [isOriginLoading, setOriginLoading] = useState(false);
  const [isResourceLoading, setResourceLoading] = useState(false);
  const [isAssignedLoading, setAssignedLoading] = useState(false);
  const [filterState, setFilterState] = useMergeState({
    origin_facility: filter.origin_facility || "",
    origin_facility_ref: null,
    approving_facility: filter.approving_facility || "",
    approving_facility_ref: null,
    assigned_facility: filter.assigned_facility || "",
    assigned_facility_ref: null,
    emergency: filter.emergency || "--",
    created_date_before: filter.created_date_before || null,
    created_date_after: filter.created_date_after || null,
    modified_date_before: filter.modified_date_before || null,
    modified_date_after: filter.modified_date_after || null,
    ordering: filter.ordering || null,
    status: filter.status || null,
  });
  const dispatch: any = useDispatch();

  useEffect(() => {
    async function fetchData() {
      if (filter.origin_facility) {
        setOriginLoading(true);
        const res = await dispatch(
          getAnyFacility(filter.origin_facility, "origin_facility")
        );
        if (res && res.data) {
          setFilterState({ origin_facility_ref: res.data });
        }
        setOriginLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      if (filter.approving_facility) {
        setResourceLoading(true);
        const res = await dispatch(
          getAnyFacility(filter.approving_facility, "approving_facility")
        );
        if (res && res.data) {
          setFilterState({ approving_facility_ref: res.data });
        }
        setResourceLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      if (filter.assigned_facility) {
        setAssignedLoading(true);
        const res = await dispatch(
          getAnyFacility(filter.assigned_facility, "assigned_facility")
        );
        if (res && res.data) {
          setFilterState({ assigned_facility_ref: res.data });
        }
        setAssignedLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  const setFacility = (selected: any, name: string) => {
    setFilterState({
      ...filterState,
      [`${name}_ref`]: selected,
      [name]: (selected || {}).id,
    });
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFilterState({ ...filterState, [name]: value });
  };

  const applyFilter = () => {
    const {
      origin_facility,
      approving_facility,
      assigned_facility,
      emergency,
      created_date_before,
      created_date_after,
      modified_date_before,
      modified_date_after,
      ordering,
      status,
    } = filterState;
    const data = {
      origin_facility: origin_facility || "",
      approving_facility: approving_facility || "",
      assigned_facility: assigned_facility || "",
      emergency: emergency || "",
      created_date_before:
        created_date_before && moment(created_date_before).isValid()
          ? moment(created_date_before).format("YYYY-MM-DD")
          : "",
      created_date_after:
        created_date_after && moment(created_date_after).isValid()
          ? moment(created_date_after).format("YYYY-MM-DD")
          : "",
      modified_date_before:
        modified_date_before && moment(modified_date_before).isValid()
          ? moment(modified_date_before).format("YYYY-MM-DD")
          : "",
      modified_date_after:
        modified_date_after && moment(modified_date_after).isValid()
          ? moment(modified_date_after).format("YYYY-MM-DD")
          : "",
      ordering: ordering || "",
      status: status || "",
    };
    onChange(data);
  };

  const handleDateRangeChange = (
    startDateId: string,
    endDateId: string,
    { startDate, endDate }: any
  ) => {
    const filterData: any = { ...filterState };
    filterData[startDateId] = startDate?.toString();
    filterData[endDateId] = endDate?.toString();

    setFilterState(filterData);
  };
  return (
    <FiltersSlideover
      advancedFilter={props}
      onApply={applyFilter}
      onClear={() => {
        navigate("/resource");
        setFilterState(clearFilterState);
        closeFilter();
      }}
    >
      {props.showResourceStatus && (
        <div>
          <FieldLabel>Status</FieldLabel>
          <LegacySelectField
            name="status"
            variant="outlined"
            margin="dense"
            optionArray={true}
            value={filterState.status}
            options={["--", ...resourceStatusOptions]}
            onChange={handleChange}
            className="bg-white h-10 shadow-sm md:text-sm md:leading-5 md:h-9"
          />
        </div>
      )}
      <div>
        <FieldLabel>Origin facility</FieldLabel>
        <div>
          {isOriginLoading ? (
            <CircularProgress size={20} />
          ) : (
            <FacilitySelect
              multiple={false}
              name="origin_facility"
              selected={filterState.origin_facility_ref}
              setSelected={(obj) => setFacility(obj, "origin_facility")}
              className="resource-page-filter-dropdown"
              errors={""}
            />
          )}
        </div>
      </div>

      <div>
        <FieldLabel>Resource approving facility</FieldLabel>
        <div className="">
          {isResourceLoading ? (
            <CircularProgress size={20} />
          ) : (
            <FacilitySelect
              multiple={false}
              name="approving_facility"
              selected={filterState.approving_facility_ref}
              setSelected={(obj) => setFacility(obj, "approving_facility")}
              className="resource-page-filter-dropdown"
              errors={""}
            />
          )}
        </div>
      </div>

      <div>
        <FieldLabel>Assigned facility</FieldLabel>
        <div>
          {isAssignedLoading ? (
            <CircularProgress size={20} />
          ) : (
            <FacilitySelect
              multiple={false}
              name="assigned_facility"
              selected={filterState.assigned_facility_ref}
              setSelected={(obj) => setFacility(obj, "assigned_facility")}
              className="resource-page-filter-dropdown"
              errors={""}
            />
          )}
        </div>
      </div>
      <div>
        <FieldLabel>Ordering</FieldLabel>
        <LegacySelectField
          name="ordering"
          variant="outlined"
          margin="dense"
          optionKey="text"
          optionValue="desc"
          value={filterState.ordering}
          options={RESOURCE_FILTER_ORDER}
          onChange={handleChange}
          className="bg-white h-10 shadow-sm md:text-sm md:leading-5 md:h-9"
        />
      </div>

      <div>
        <FieldLabel>Is emergency case</FieldLabel>
        <LegacySelectField
          name="emergency"
          variant="outlined"
          margin="dense"
          optionArray={true}
          value={filterState.emergency}
          options={["--", "yes", "no"]}
          onChange={handleChange}
          className="bg-white h-10 shadow-sm md:text-sm md:leading-5 md:h-9"
        />
      </div>

      <DateRangePicker
        startDate={getDate(filterState.created_date_after)}
        endDate={getDate(filterState.created_date_before)}
        onChange={(e) =>
          handleDateRangeChange("created_date_after", "created_date_before", e)
        }
        endDateId={"created_date_before"}
        startDateId={"created_date_after"}
        label={"Created Date"}
        size="small"
      />
      <DateRangePicker
        startDate={getDate(filterState.modified_date_after)}
        endDate={getDate(filterState.modified_date_before)}
        onChange={(e) =>
          handleDateRangeChange(
            "modified_date_after",
            "modified_date_before",
            e
          )
        }
        endDateId={"modified_date_before"}
        startDateId={"modified_date_after"}
        label={"Modified Date"}
        size="small"
      />
    </FiltersSlideover>
  );
}
