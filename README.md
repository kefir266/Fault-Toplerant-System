# Test assigment

## Full-Stack Assignment: Fault-Tolerant System Design

### **Full-Stack Assignment: Fault-Tolerant System Design**

#### **Overview**

Create a fault-tolerant, full-stack application that processes tasks in an event-driven architecture. This system should include a backend for processing tasks and a frontend built with Angular using NGXS for state management. The goal is to evaluate your ability to design and implement a scalable and reliable full-stack application that gracefully handles failures.

This system will simulate a **data processing pipeline** where:

1. Users submit tasks through a frontend UI.
2. The backend processes tasks asynchronously, with retry mechanisms and fault tolerance.
3. Failed tasks are routed to a dead-letter queue (DLQ) and logged in CloudWatch.

---

#### **Specifications**

1. [**Figma design**](https://www.figma.com/design/35QkmYxBL12n0aJ9XpSHdW/Full-Stack-Home-Assignment?node-id=0-1)**.**
2. **Frontend**:
   - Build a user interface with Angular and NGXS for state management.
   - Features:
     - **Task Submission**:
       - A form to submit task answers with the following fields:
         - `answer` (string, textarea for answer input).
         - `taskId` (string, unique, auto-generated in the frontend, not shown in the form)
       - A button to submit the task to the backend.
     - **Task Status Dashboard**:
       - A table that displays the status of submitted tasks, including:
         - `taskId`
         - `answer`
         - `Status` (`Pending`, `Processed`, `Failed`)
         - `Retries` (number of attempts made)
         - `Error Message` (if applicable)
   - Provide visual feedback during task submission and processing (e.g., loaders or status updates).
3. **Backend**:
   - Build a Node.js backend that:
     - Accepts task submissions via a RESTful API (AWS API Gateway \+ Lambda).
     - Processes tasks asynchronously using AWS SQS and Lambda.
     - Implements an exponential backoff retry strategy for failed tasks.
     - Routes unprocessable tasks to a dead-letter queue (DLQ) after the maximum retry limit (2) is reached.
     - DLQ Monitoring \- add a Lambda function that monitors the DLQ and logs the details of failed tasks in CloudWatch.
   - Use DynamoDB to store the state of each task, including:
     - `taskId`
     - `answer`
     - `status`
     - `retries`
     - `errorMessage`
   - Expose an API endpoint to:
     - Submit the task answer
     - Fetch the status of all task answers.
4. **Design Constraints**:
   - **Frontend**:
     - Implement NGXS for managing the application state.
   - **Backend**:
     - Use AWS services (API Gateway, Lambda, SQS, DynamoDB).
     - Use the Serverless framework for deployment and management.
   - Simulate task processing failures randomly for 30% of the tasks.
5. **Key Features**:
   - **Frontend**:
     - Form-based task submission.
     - Task Status Dashboard
     - Real-time status updates for tasks using polling or WebSocket (optional for bonus points).
   - **Backend**:
     - Fault tolerance using retries and exponential backoff.
     - DLQ integration for handling unprocessable tasks.
     - APIs for task submission and status retrieval.

---

#### **Documentation:**

- Provide a README.md file that includes:
  - Setup instructions for both the backend and frontend.
  - A high-level architecture diagram.
  - Testing instructions.
  - Any assumptions or challenges faced.

---

#### **Submission:**

1. **Git Repository**:
   - Include the full frontend and backend codebases.
   - Provide clear instructions in the `README.md` for setting up and running the application locally.ate a data processing pipeline where:

# Solution:

This repository contains a full-stack application designed to process tasks in an event-driven architecture. The system includes a frontend built with Angular and NGXS for state management, and a backend implemented with Node.js, AWS Lambda, SQS, and DynamoDB.
To implement backoff retry strategy, I used AWS Step Functions

## Installation

1. Clone the repository.
2. Fill in omitted values in the `backend/serverless.yml` file
3. set base URL for the frontend in the `src/environments/environment.ts` file
4. run `npm install`
5. run `npm run build` to build the Angular application.
6. run `npm install` in the `backend` directory to install the backend dependencies.
7. deploy serverless by `sls deploy`

### Not solved issues

- in some reason serverless didn't create httpApi endpoint, only restApi.
- design not fully implemented
