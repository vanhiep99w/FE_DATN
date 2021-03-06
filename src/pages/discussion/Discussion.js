import React, { Component } from "react";
import Avatar from "../../components/avatar/Avatar";
import timeCloudAPI from "../../apis/timeCloudAPI";
import "./Discussion.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import DiscussionItem from "./discussionItem/DiscussionItem";
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DropDown2 from "../../components/dropdown2/DropDown2";
import Skeleton from "../../components/loading/skeleton/Skeleton";
import { USER_ID } from "../../utils/localStorageContact";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Spinner from "../../components/loading/spinner/Spinner";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";

const defaultSelect = { id: 0, name: "All" };
const types = ["All", "Bug", "Feature", "Approve", "Others"];
class Discussion extends Component {
  state = {
    projects: [defaultSelect],
    projectSelected: null,
    selectedTypeIndex: 0,
    discussions: [],
    isLoading: false,
    showDDProject: false,
    showDDType: false,
    discussionInput: "",
    currentPage: 0,
    showInputDiscussion: false,
    isSavingDiscussion: false,
    loadingMore: false,
    over: false,
  };

  contentRef = React.createRef();
  buttonBottomRef = React.createRef();

  onClickOutSizeFooter = (event) => {
    if (
      this.buttonBottomRef.current &&
      this.state.showInputDiscussion &&
      !this.state.discussionInput
    ) {
      this.buttonBottomRef.current.click();
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true, projectSelected: defaultSelect });
    timeCloudAPI()
      .get(`users/${localStorage.getItem(USER_ID)}/project-user-available`)
      .then((res) => {
        this.setState({
          projects: [
            ...this.state.projects,
            ...res.data.map((ele) => ele.project),
          ],
        });
      });
    this.fetchAllDiscussion(
      this.state.currentPage,
      7,
      "createAt",
      this.state.selectedTypeIndex
    ).then((res) => this.setState({ discussions: res, isLoading: false }));
    window.addEventListener("click", this.onClickOutSizeFooter);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onClickOutSizeFooter);
  }

  onFormSubmit(event) {
    const { discussionInput, projectSelected } = this.state;
    event.preventDefault();
    if (discussionInput && projectSelected.id !== 0) {
      this.setState({ isSavingDiscussion: true });
      timeCloudAPI()
        .post("discussions", {
          content: discussionInput,
          userId: localStorage.getItem(USER_ID),
          projectId: projectSelected.id,
        })
        .then((res) => {
          this.setState({
            discussions: [res.data, ...this.state.discussions],
            discussionInput: "",
            isSavingDiscussion: false,
          });
        });
    }
  }

  async fetchAllDiscussion(page, limit, sortBy, type) {
    const res = await timeCloudAPI().get(
      `users/${localStorage.getItem(USER_ID)}/discussions?type=${
        type === 0 ? "" : type - 1
      }&limit=${limit}&page=${page}&sort_by=${sortBy}`
    );
    return res.data;
  }
  async fetchAllDiscussionByProjectId(
    projectId,
    page,
    limit,
    sortBy,
    order,
    type
  ) {
    const res = await timeCloudAPI().get(
      `projects/${projectId}/discussions?type=${
        type === 0 ? "" : type - 1
      }&limit=${limit}&page=${page}&sort_by=${sortBy}&order=${order}`
    );
    return res.data;
  }
  async fetchDiscussions(page, limit) {
    const { projectSelected, selectedTypeIndex } = this.state;
    console.log(projectSelected, selectedTypeIndex);
    if (projectSelected.id === 0) {
      return await this.fetchAllDiscussion(
        page,
        limit,
        "createAt",
        selectedTypeIndex
      );
    } else {
      return await this.fetchAllDiscussionByProjectId(
        projectSelected.id,
        page,
        limit,
        "createAt",
        "DESC",
        selectedTypeIndex
      );
    }
  }

  onScrollContentHandler = (event) => {
    const { scrollHeight, offsetHeight, scrollTop } = event.currentTarget;

    if (
      scrollHeight - Math.ceil(scrollTop) === offsetHeight &&
      !this.state.loadingMore
    ) {
      this.setState({ loadingMore: true });
      const { currentPage, discussions } = this.state;
      this.fetchDiscussions(currentPage + 1, 7).then((res) => {
        if (res.length) {
          this.setState({
            discussions: [...discussions, ...res],
            currentPage: currentPage + 1,
          });
          this.contentRef.current.scroll({
            top: scrollTop,
            behavior: "auto",
          });
          this.setState({ loadingMore: false });
        } else {
          this.setState({ over: true });
        }
      });
    }
  };

  onSelectProject = (project) => {
    if (project.id !== this.state.projectSelected) {
      this.setState(
        {
          showDDProject: false,
          projectSelected: project,
          isLoading: true,
          currentPage: 0,
        },
        () => {
          this.fetchDiscussions(this.state.currentPage, 7).then((res) =>
            this.setState({ discussions: res, isLoading: false })
          );
        }
      );
    }
  };
  renderContentDDProject = () => {
    return (
      <div
        className="discussion__content_dd_project"
        onClick={(e) => e.stopPropagation()}
      >
        {this.state.projects.map((project) => {
          return (
            <p key={project.id} onClick={() => this.onSelectProject(project)}>
              {project.name}
              {this.props.managedProjects.some(
                (ele) => ele.id === project.id
              ) && <span>PM</span>}
            </p>
          );
        })}
      </div>
    );
  };

  renderContentDDType = () => {
    return (
      <div
        className="discussion__content_dd_project"
        onClick={(e) => e.stopPropagation()}
      >
        {types.map((type, index) => {
          return (
            <p
              key={index}
              onClick={() =>
                this.setState(
                  {
                    selectedTypeIndex: index,
                    showDDType: false,
                    isLoading: true,
                    currentPage: 0,
                  },
                  () => {
                    this.fetchDiscussions(
                      this.state.currentPage,
                      7
                    ).then((res) =>
                      this.setState({ discussions: res, isLoading: false })
                    );
                  }
                )
              }
            >
              {type}
            </p>
          );
        })}
      </div>
    );
  };

  onDeleteItem = (discussion) => {
    this.setState({
      discussions: this.state.discussions.filter(
        (ele) => ele.id !== discussion.id
      ),
    });
    timeCloudAPI().delete(`discussions/${discussion.id}`);
  };

  renderFilter = () => {
    const { projectSelected, selectedTypeIndex } = this.state;
    return (
      <div className="discussion__filter">
        {/* <span>Type</span>
        <div
          onClick={() => this.setState({ showDDType: true })}
          className="discussion__filter__item discussion__filter__type"
        >
          <span>{types[selectedTypeIndex]}</span>
          <ExpandMoreIcon />
          <DropDown2
            isShow={this.state.showDDType}
            onCloseHandler={() => this.setState({ showDDType: false })}
            renderContent={() => this.renderContentDDType()}
            css={{
              boxShadow: "3px 3px 15px rgba(133,134,245, .7)",
              borderRadius: ".5rem",
              transform: "translateY(105%) translateX(0%)",
              border: "1px solid #8586F5",
              padding: "2px",
            }}
          />
        </div> */}
        <span>Project</span>
        <div
          onClick={() => this.setState({ showDDProject: true })}
          className="discussion__filter__item discussion__filter__project"
        >
          <span>{projectSelected?.name}</span>
          <ExpandMoreIcon />
          <DropDown2
            isShow={this.state.showDDProject}
            onCloseHandler={() => this.setState({ showDDProject: false })}
            renderContent={() => this.renderContentDDProject()}
            css={{
              boxShadow: "3px 3px 15px rgba(133,134,245, .7)",
              borderRadius: ".5rem",
              transform: "translateY(105%) translateX(0%)",
              border: "1px solid #8586F5",
              padding: "2px",
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      discussionInput,
      discussions,
      isLoading,
      showInputDiscussion,
      projectSelected,
      isSavingDiscussion,
      loadingMore,
      over,
    } = this.state;
    return (
      <PageDesign
        title="Discussion"
        headerRight={this.renderFilter()}
        css={{ paddingBottom: "2rem" }}
      >
        <div className="discussion">
          {isLoading ? (
            <>
              <Skeleton countItem={5} direction="row" heightItem="6rem" />
              <Skeleton countItem={2} direction="row" heightItem="6rem" />
              <Skeleton countItem={4} direction="row" heightItem="6rem" />
              <Skeleton countItem={1} direction="row" heightItem="6rem" />
              <Skeleton countItem={2} direction="row" heightItem="6rem" />
            </>
          ) : (
            <div
              className="discussion__content"
              onScroll={this.onScrollContentHandler}
              ref={this.contentRef}
            >
              {discussions.length ? (
                discussions.map((discussion) => {
                  return (
                    <DiscussionItem
                      key={discussion.id}
                      user={this.props.user}
                      discussion={discussion}
                      onDeleteItem={() => this.onDeleteItem(discussion)}
                      project={projectSelected}
                    />
                  );
                })
              ) : (
                <p>
                  {" "}
                  <PriorityHighIcon
                    style={{ fontSize: "4rem", color: "red" }}
                  />
                  There is no any discussion. Click input button bellow to
                  discuss...
                </p>
              )}
              {loadingMore &&
                (over || (
                  <div style={{ padding: "1rem" }}>
                    <div
                      style={{
                        width: "5rem",
                        height: "5rem",
                        margin: "0 auto",
                      }}
                    >
                      <Spinner />
                    </div>
                  </div>
                ))}
            </div>
          )}
          {projectSelected?.id !== 0 && (
            <div
              className="discussion__footer"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`discussion__footer__input ${
                  showInputDiscussion ? "visible" : ""
                }`}
              >
                <Avatar
                  avatar={this.props.user?.avatar}
                  avatarSize="3.5rem"
                  cssImage={{ boxShadow: "2px 2px 1rem rgba(0, 0, 0, .6)" }}
                />
                <form onSubmit={(e) => this.onFormSubmit(e)}>
                  <input
                    name="discussion"
                    value={discussionInput}
                    onChange={(e) => {
                      this.setState({ discussionInput: e.target.value });
                    }}
                    type="text"
                    placeholder="Write discussion..."
                    autoComplete="off"
                  />
                </form>
              </div>

              <button
                ref={this.buttonBottomRef}
                onClick={() => {
                  this.setState({
                    showInputDiscussion: !showInputDiscussion,
                  });
                }}
              >
                {isSavingDiscussion ? (
                  <Spinner />
                ) : showInputDiscussion ? (
                  <RemoveIcon />
                ) : (
                  <AddIcon />
                )}
              </button>
            </div>
          )}
        </div>
      </PageDesign>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, managedProjects } = state.auth;
  return {
    user,
    managedProjects,
  };
};

export default connect(mapStateToProps)(Discussion);
