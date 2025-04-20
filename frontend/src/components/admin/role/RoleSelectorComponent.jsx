import React, { useState, useEffect } from "react";
import FormGroupComponent from "../../common/FormGroupComponent";
import { getRoles } from "../../../services/admin/roleService";

const RoleSelectorComponent = ({
  label = "Phân quyền",
  name = "role_id",
  value,
  onChange,
  required,
}) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        if (response.code === 200) {
          setRoles(response.roles);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const roleOptions = [
    { value: "", label: "-- Chọn --" },
    ...roles.map((role) => ({
      value: role._id,
      label: role.title,
    })),
  ];

  return (
    <FormGroupComponent
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      options={roleOptions}
      required={required}
    />
  );
};

export default RoleSelectorComponent;
