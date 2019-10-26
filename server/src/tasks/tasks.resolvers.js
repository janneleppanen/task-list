const Mutation = {
  createTask: async (parent, args, ctx, info) => {
    if (!ctx.req.userId) throw new Error("You must be logged in");
    if (!args.data.project) {
      const project = await ctx
        .db("project")
        .where({ name: "Inbox", user_id: ctx.req.userId })
        .first();
      if (!project) throw new Error("Project not found");
      args.data.project = project.id;
    }
    const { project: project_id, ...newTaskData } = args.data;

    // Set the highest order number
    const otherTasks = await ctx.db("task").where({ project_id: project_id });
    newTaskData.order_number =
      Math.max(...otherTasks.map(t => t.order_number), -1) + 1;

    const [task] = await ctx
      .db("task")
      .returning("*")
      .insert({
        ...newTaskData,
        project_id
      });

    return task;
  },
  updateTask: async (parent, args, ctx, info) => {
    if (!ctx.req.userId) throw new Error("You must be logged in");
    if (args.data.project && args.data.project !== ctx.req.userId)
      throw new Error("Cannot move the task to a project you don't own");

    const task = await ctx
      .db("user")
      .innerJoin("project", "user.id", "project.user_id")
      .innerJoin("task", "project.id", "task.project_id")
      .where({ "task.id": args.id, user_id: ctx.req.userId })
      .first();

    if (!task) throw new Error("Task not found");

    const { id, data } = args;
    const [updatedTask] = await ctx
      .db("task")
      .where({ id })
      .returning("*")
      .update({ ...data });

    return updatedTask;
  },
  deleteTask: async (parent, args, ctx, info) => {
    if (!ctx.req.userId) throw new Error("You must be logged in");
    const task = await ctx
      .db("user")
      .innerJoin("project", "user.id", "project.user_id")
      .innerJoin("task", "project.id", "task.project_id")
      .where({ "task.id": args.id, user_id: ctx.req.userId })
      .first();
    if (!task) throw new Error("Task not found");

    const [deletedTask] = await ctx
      .db("task")
      .returning("*")
      .where({ id: args.id })
      .delete();
    return deletedTask;
  },
  reorderTasks: async (parent, args, ctx, info) => {
    if (!ctx.req.userId) throw new Error("You must be logged in");

    const [project] = await ctx
      .db("project")
      .where({ id: args.project, user_id: ctx.req.userId });

    if (!project) throw new Error("You can reorder only your own projects");

    args.taskMap.map(async (taskId, index) => {
      await ctx
        .db("task")
        .where({ id: taskId, project_id: project.id })
        .returning("*")
        .update({ order_number: index });
    });

    return await ctx
      .db("task")
      .returning("*")
      .where({ project_id: project.id });
  }
};

exports.Mutation = Mutation;
