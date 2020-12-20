import "./SearchMembers.css";
import DropDown2 from "../../../../components/dropdown2/DropDown2";
import Avatar from "../../../../components/avatar/Avatar";
import React, { useState, useEffect } from "react";
import { includesIgnoreCase } from "../../../../utils/Utils";

const SearchMembers = ({ onSelectItemHandler, members, teamMembers }) => {
  const [showDD, setShowDD] = useState(false);
  const [listSearch, setListSearch] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const onInputSearchChange = (value) => {
    setInputSearch(value);
    if (value) {
      setShowDD(true);
    } else {
      setShowDD(false);
    }
  };

  const onSelectItem = (member) => {
    setInputSearch("");
    onSelectItemHandler(member);
  };

  const renderContentDD = () => {
    return listSearch.map((ele) => {
      return (
        <div
          key={ele.id}
          className="team-members__dd__user-info"
          onClick={() => onSelectItem(ele)}
        >
          <Avatar
            avatar={ele.avatar}
            avatarSize="4rem"
            css={{ alignItems: "stretch", padding: ".8rem 1.5rem" }}
          >
            <div className=" team-members__member-info">
              <p>{ele.name}</p>
              <p>{ele.email}</p>
            </div>
          </Avatar>
        </div>
      );
    });
  };

  useEffect(() => {
    if (inputSearch) {
      setListSearch(
        members.filter(
          (ele) =>
            (includesIgnoreCase(ele.name, inputSearch) ||
              includesIgnoreCase(ele.email, inputSearch)) &&
            !teamMembers.some((e) => e.id === ele.id)
        )
      );
    } else {
      setListSearch([]);
    }
  }, [inputSearch, members, teamMembers]);

  return (
    <div className="search-members">
      <input
        placeholder="Add more people..."
        value={inputSearch}
        onChange={(event) => onInputSearchChange(event.target.value)}
      />

      <DropDown2
        isShow={showDD}
        onCloseHandler={() => setShowDD(false)}
        renderContent={renderContentDD}
        css={{
          padding: 0,
          overflow: "hidden",
          cursor: "pointer",
          transform: "translateY(105%) translateX(-10%)",
          minWidth: "19.5rem",
          borderRadius: ".3rem",
        }}
      />
    </div>
  );
};

export default SearchMembers;
