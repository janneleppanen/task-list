import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { optimisticallyUpdateProjectsQuery } from "../project/projectRequests";
import { Task, Project } from "./TaskList";
import { PROJECTS_QUERY } from "../project/projectRequests";

export const CREATE_TASK_MUTATION = gql`
  mutation create_task($data: TaskInput!) {
    createTask(data: $data) {
      id
      description
      done
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation updateTask($id: ID!, $data: TaskUpdateInput!) {
    updateTask(id: $id, data: $data) {
      id
      description
      done
    }
  }
`;

type UseTaskCreateMutationVariables = {
  description: string;
  done: boolean;
  project: string;
};

export const useCreateTaskMutation = () => {
  const [createTaskMutation] = useMutation(CREATE_TASK_MUTATION);
  return (data: UseTaskCreateMutationVariables) =>
    createTaskMutation({
      variables: {
        data
      },
      refetchQueries: [{ query: PROJECTS_QUERY }],
      optimisticResponse: {
        __typename: "Mutation",
        createTask: {
          __typename: "task",
          id: "optimistic",
          description: data.description,
          done: false
        }
      },
      update: (proxy, { data: proxyData }) => {
        const task: Task = proxyData.createTask;
        optimisticallyUpdateProjectsQuery((projects: Project[]) => {
          return projects.map(project => {
            if (project.id === data.project) {
              project.tasks = [...project.tasks, task];
            }
            return project;
          });
        }, proxy);
      }
    });
};

type UseTaskUpdateMutationVariables = {
  done: boolean;
  description: string;
};
export const useUpdateTaskMutation = () => {
  const [updateTaskMutation] = useMutation(UPDATE_TASK_MUTATION);
  return (id: string, data: UseTaskUpdateMutationVariables) => {
    const optimisticResponse = {
      __typename: "Mutation",
      updateTask: {
        __typename: "Task",
        id,
        description: data.description,
        done: data.done
      }
    };

    return updateTaskMutation({
      variables: {
        id,
        data
      },
      refetchQueries: [{ query: PROJECTS_QUERY }],
      optimisticResponse,
      update: (proxy, mutationResult) => {
        const task: Task = mutationResult.data.updateTask;
        optimisticallyUpdateProjectsQuery((projects: Project[]) => {
          return projects.map(project => {
            project.tasks = project.tasks.map(t => {
              return t.id === task.id ? task : t;
            });
            return project;
          });
        }, proxy);
      }
    });
  };
};

export const useDeleteTaskMutation = () => {
  const [deleteTaskMutation] = useMutation(DELETE_TASK_MUTATION);
  return (id: string) => {
    const optimisticResponse = {
      __typename: "Mutation",
      deleteTask: {
        __typename: "Task",
        id
      }
    };

    return deleteTaskMutation({
      variables: { id },
      refetchQueries: [{ query: PROJECTS_QUERY }],
      optimisticResponse,
      update: (proxy, mutationResult) => {
        const task: Task = mutationResult.data.deleteTask;

        optimisticallyUpdateProjectsQuery((projects: Project[]) => {
          return projects.map(project => {
            project.tasks = project.tasks.filter(t => t.id !== task.id);
            return project;
          });
        }, proxy);
      }
    });
  };
};
