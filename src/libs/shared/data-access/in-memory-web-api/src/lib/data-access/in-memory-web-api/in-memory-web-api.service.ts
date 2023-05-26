import { Department, User } from '@nsp/departments';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { NSPChallengeDatabase } from './typings';

export class InMemoryWebApiService implements InMemoryDbService {
  createDb() {
    const db: NSPChallengeDatabase  = {
      "departments": [
        {
          "id": 1,
          "name": "Marketing",
          "users": [1, 2]
        },
        {
          "id": 2,
          "name": "Sales",
          "users": [3, 4]
        }
      ],
      "users": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "johndoe@company.com"
        },
        {
          "id": 2,
          "name": "Jane Smith",
          "email": "janesmith@company.com"
        },
        {
          "id": 3,
          "name": "Bob Johnson",
          "email": "bobjohnson@company.com"
        },
        {
          "id": 4,
          "name": "Alice Brown",
          "email": "alicebrown@company.com"
        }
      ]
    };

    return db;
  }

  get(reqInfo: RequestInfo): Observable<unknown> | undefined {
    if (reqInfo.collectionName === 'departments' && reqInfo.resourceUrl.startsWith('api/departments/')) {
      if (reqInfo.method === 'get' && reqInfo.url.match(/api\/departments\/(\d+)\/users/)) {
        return this.getUsersByDepartment(reqInfo);
      }
    }

    return undefined;
  }

  post(reqInfo: RequestInfo): Observable<unknown> | undefined {
    if (reqInfo.collectionName === 'departments' && reqInfo.resourceUrl.startsWith('api/departments/')) {
      if (reqInfo.method === 'post' && reqInfo.url.match(/api\/departments\/(\d+)\/users/)) {
        return this.addUserToDepartment(reqInfo);
      }
    }
    return undefined;
  }

  put(reqInfo: RequestInfo): Observable<unknown> | undefined {
    if (reqInfo.collectionName === 'departments' && reqInfo.resourceUrl.startsWith('api/departments/')) {
      if (reqInfo.method === 'put' && reqInfo.url.match(/api\/departments\/(\d+)\/users/)) {
        return this.updateUser(reqInfo);
      }
    }
    return undefined;
  }

  delete(reqInfo: RequestInfo): Observable<unknown> | undefined {
    if (reqInfo.collectionName === 'departments' && reqInfo.resourceUrl.startsWith('api/departments/')) {
      if (reqInfo.method === 'delete' && reqInfo.url.match(/api\/departments\/(\d+)\/users/)) {
        return this.deleteUser(reqInfo);
      }
    }
    return undefined;
  }

  private addUserToDepartment(reqInfo: RequestInfo): Observable<unknown> {
    const departmentId = reqInfo.id;
    // @ts-expect-error - Skipping lint errors for testing purposes
    const newUser = reqInfo.req.body;
    const departments = reqInfo.collection as Department[];
    const usersCollection = (reqInfo.utils.getDb() as NSPChallengeDatabase)['users'];
    const department = departments.find((dept: Department) => dept.id === departmentId);

    if (department) {
      const userId = new Date().getTime();
      const user: User = {
        ...newUser,
        id: userId,
      };

      department.users.push(user.id);
      usersCollection.push(user);

      return reqInfo.utils.createResponse$(() => ({
        body: user,
        status: STATUS.OK
      }));
    }

    return reqInfo.utils.createResponse$(() => ({
      body: { error: 'Department not found' },
      status: STATUS.NOT_FOUND
    }));
  }

  private updateUser(reqInfo: RequestInfo): Observable<unknown> {
    const departmentId = reqInfo.id;
    // @ts-expect-error - Skipping lint errors for testing purposes
    const updatedUser = reqInfo.req.body;
    const departments = reqInfo.collection as Department[];
    const ddBB = (reqInfo.utils.getDb() as NSPChallengeDatabase);
    const department = departments.find((dept: Department) => dept.id === departmentId);

    if (department) {
      const userChangedDepartment = !department.users.includes(updatedUser.id);

      if (userChangedDepartment) {
        const previousDepartment = departments.find(department => department.users.includes(updatedUser.id));
        department.users.push(updatedUser.id);

        if (previousDepartment) {
          previousDepartment.users = previousDepartment?.users.filter(userId => userId !== updatedUser.id);
        }
      }

      ddBB.users = ddBB.users.map(user => user.id === updatedUser.id ? updatedUser : user);

      return reqInfo.utils.createResponse$(() => ({
        body: updatedUser,
        status: STATUS.OK
      }));
    }

    return reqInfo.utils.createResponse$(() => ({
      body: { error: 'Department or user not found' },
      status: STATUS.NOT_FOUND
    }));
  }

  private deleteUser(reqInfo: RequestInfo): Observable<unknown> {
    const userToDeleteId = +reqInfo.url.split('/').pop()!;
    const departments = reqInfo.collection as Department[];
    const ddBB = (reqInfo.utils.getDb() as NSPChallengeDatabase);
    const department = departments.find((dept: Department) => dept.users.includes(userToDeleteId));


    if (department) {
      department?.users.filter(userId => userId !== userToDeleteId);
      ddBB.users = ddBB.users.filter(user => user.id !== userToDeleteId);

      return reqInfo.utils.createResponse$(() => ({
        body: {},
        status: STATUS.OK
      }));
    }

    return reqInfo.utils.createResponse$(() => ({
      body: { error: 'Department or user not found' },
      status: STATUS.NOT_FOUND
    }));
  }  

  private getUsersByDepartment(reqInfo: RequestInfo): Observable<unknown> {
    const departmentId = reqInfo.id;
    const departments = reqInfo.collection;
    const department = departments.find((dept: Department) => dept.id === departmentId);

    if (department) {
      const usersCollection = (reqInfo.utils.getDb() as NSPChallengeDatabase)['users'];
      const users = usersCollection.filter((user: User) => department.users.includes(user.id));
      return reqInfo.utils.createResponse$(() => ({
        body: users,
        status: STATUS.OK
      }));
    }

    return reqInfo.utils.createResponse$(() => ({
      body: { error: 'Department not found' },
      status: STATUS.NOT_FOUND
    }));
  }
}
