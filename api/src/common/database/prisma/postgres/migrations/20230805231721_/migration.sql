-- CreateTable
CREATE TABLE "action_types" (
    "type_id" VARCHAR(32) NOT NULL,
    "type_name" VARCHAR(64) NOT NULL,

    CONSTRAINT "action_types_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "local_credentials" (
    "user_id" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    CONSTRAINT "local_credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "priorities" (
    "priority_id" VARCHAR(32) NOT NULL,
    "priority_name" VARCHAR(64) NOT NULL,
    "order" SERIAL NOT NULL,

    CONSTRAINT "priorities_pkey" PRIMARY KEY ("priority_id")
);

-- CreateTable
CREATE TABLE "request_actions" (
    "action_id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "type_id" VARCHAR NOT NULL,
    "value" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR,

    CONSTRAINT "request_actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateTable
CREATE TABLE "request_assignees" (
    "user_id" VARCHAR NOT NULL,
    "request_id" UUID NOT NULL,

    CONSTRAINT "request_assignees_pkey" PRIMARY KEY ("user_id","request_id")
);

-- CreateTable
CREATE TABLE "request_blocked_node" (
    "node_id" VARCHAR NOT NULL,
    "request_id" UUID NOT NULL,

    CONSTRAINT "request_blocked_node_pkey" PRIMARY KEY ("node_id","request_id")
);

-- CreateTable
CREATE TABLE "request_files" (
    "file_id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "uploaded_by" VARCHAR NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "request_messages" (
    "message_id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,
    "created_by" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "request_outputs" (
    "input_id" VARCHAR NOT NULL,
    "node_id" VARCHAR NOT NULL,
    "request_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "request_outputs_pkey" PRIMARY KEY ("input_id","node_id")
);

-- CreateTable
CREATE TABLE "request_participants" (
    "user_id" VARCHAR NOT NULL,
    "request_id" UUID NOT NULL,

    CONSTRAINT "request_participants_pkey" PRIMARY KEY ("user_id","request_id")
);

-- CreateTable
CREATE TABLE "request_variables" (
    "var_id" VARCHAR NOT NULL,
    "node_id" VARCHAR NOT NULL,
    "request_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "request_variables_pkey" PRIMARY KEY ("var_id","node_id")
);

-- CreateTable
CREATE TABLE "requests" (
    "request_id" UUID NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "description" TEXT,
    "created_by" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tree_id" UUID,
    "tree_version" VARCHAR(36),
    "node_id" VARCHAR(32),
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "priority_id" VARCHAR NOT NULL,
    "status_id" VARCHAR NOT NULL,
    "substatus_id" UUID,
    "modified_by" VARCHAR NOT NULL,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "status_id" VARCHAR(32) NOT NULL,
    "status_name" VARCHAR(64) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "substatuses" (
    "status_id" VARCHAR NOT NULL,
    "substatus_id" UUID NOT NULL,
    "substatus_name" VARCHAR(64) NOT NULL,
    "tree_id" UUID NOT NULL,

    CONSTRAINT "substatuses_pkey" PRIMARY KEY ("status_id","substatus_id")
);

-- CreateTable
CREATE TABLE "tree_members" (
    "tree_id" UUID NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "role" VARCHAR(32) NOT NULL,

    CONSTRAINT "tree_members_pkey" PRIMARY KEY ("tree_id","user_id")
);

-- CreateTable
CREATE TABLE "tree_roles" (
    "role" VARCHAR(32) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(256) NOT NULL,

    CONSTRAINT "tree_roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "trees" (
    "tree_id" UUID NOT NULL,
    "tree_name" VARCHAR(64) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trees_pkey" PRIMARY KEY ("tree_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "auth_strategy" VARCHAR,
    "avatar_url" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "priorities_priority_name_key" ON "priorities"("priority_name");

-- CreateIndex
CREATE UNIQUE INDEX "priorities_order_key" ON "priorities"("order");

-- CreateIndex
CREATE UNIQUE INDEX "statuses_status_name_key" ON "statuses"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "substatuses_substatus_name_key" ON "substatuses"("substatus_name");

-- CreateIndex
CREATE UNIQUE INDEX "trees_tree_name_key" ON "trees"("tree_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "fullName" ON "users"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "local_credentials" ADD CONSTRAINT "local_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_actions" ADD CONSTRAINT "request_actions_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "action_types"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_actions" ADD CONSTRAINT "request_actions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_actions" ADD CONSTRAINT "request_actions_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_assignees" ADD CONSTRAINT "request_assignees_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_assignees" ADD CONSTRAINT "request_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_blocked_node" ADD CONSTRAINT "request_blocked_node_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_files" ADD CONSTRAINT "request_files_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_files" ADD CONSTRAINT "request_files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_messages" ADD CONSTRAINT "request_messages_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_messages" ADD CONSTRAINT "request_messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_outputs" ADD CONSTRAINT "request_outputs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_participants" ADD CONSTRAINT "request_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_participants" ADD CONSTRAINT "request_participants_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_variables" ADD CONSTRAINT "request_variables_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_status_id_substatus_id_fkey" FOREIGN KEY ("status_id", "substatus_id") REFERENCES "substatuses"("status_id", "substatus_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "priorities"("priority_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_tree_id_fkey" FOREIGN KEY ("tree_id") REFERENCES "trees"("tree_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "substatuses" ADD CONSTRAINT "substatuses_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "substatuses" ADD CONSTRAINT "substatuses_tree_id_fkey" FOREIGN KEY ("tree_id") REFERENCES "trees"("tree_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tree_members" ADD CONSTRAINT "tree_members_role_fkey" FOREIGN KEY ("role") REFERENCES "tree_roles"("role") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tree_members" ADD CONSTRAINT "tree_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tree_members" ADD CONSTRAINT "tree_members_tree_id_fkey" FOREIGN KEY ("tree_id") REFERENCES "trees"("tree_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
