import React from "react";

const SelectTreeComponent = ({ items, level = 0 }) => {
  return items.map((item) => (
    <React.Fragment key={item._id}>
      <option value={item._id}>
        {"-- ".repeat(level)}
        {item.title}
      </option>
      {item.children && item.children.length > 0 && (
        <SelectTreeComponent items={item.children} level={level + 1} />
      )}
    </React.Fragment>
  ));
};

export default SelectTreeComponent;
