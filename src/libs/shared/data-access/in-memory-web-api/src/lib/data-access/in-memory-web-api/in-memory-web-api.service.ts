import { Department, User } from '@nsp/departments';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
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

private getUsersByDepartment(reqInfo: RequestInfo): Observable<unknown> {
  const departmentId = reqInfo.id;
  const departments = reqInfo.collection;
  const department = departments.find((dept: Department) => dept.id === departmentId);

  if (department) {
    const usersCollection = (reqInfo.utils.getDb() as NSPChallengeDatabase)['users'];
    const users = usersCollection.filter((user: User) => department.users.includes(user.id));
    return reqInfo.utils.createResponse$(() => ({
      body: users,
      status: 200
    }));
  }

  return reqInfo.utils.createResponse$(() => ({
    body: { error: 'Department not found' },
    status: 404
  }));
}
}
