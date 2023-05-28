import { DepartmentsListPageObject } from "../support/app.po";

describe('nsp-challenge', () => {
  beforeEach(() => cy.visit('http://localhost:4200'));

  context('Home', () => {
    context('Departments List', () => {
      it('should show all the departments', () => {
        DepartmentsListPageObject.getDepartments().should('have.length', 2);
      });

      it('should add departments with no users', () => {
        const newDepartmentName = 'Test department';

        DepartmentsListPageObject.addDepartment(newDepartmentName);

        DepartmentsListPageObject.getDepartments().should('have.length', 3);
        DepartmentsListPageObject.getDepartment(0).should('include.text', newDepartmentName);
      });

      it('should edit departments', () => {
        const newDepartmentName = 'Test department';

        DepartmentsListPageObject.editDepartment(0, newDepartmentName);        

        DepartmentsListPageObject.getDepartment(0).should('include.text', newDepartmentName);
      });

      it('should delete departments', () => {
        DepartmentsListPageObject.deleteDepartment(0);

        DepartmentsListPageObject.getDepartments().should('have.length', 1);
      });

      context('Department', () => {
        it('should show the title of the department', () => {
          DepartmentsListPageObject
            .getDepartment(0)
            .find('[data-testid="department-name"]')
            .should('include.text', 'Marketing');
        });

        it('should show the users list', () => {
          DepartmentsListPageObject.getDepartment(0).click();
          DepartmentsListPageObject.getDepartmentUsersList(0).should('exist');
        });

        context('Users List', () => {
          it('should show all the users', () => {
            DepartmentsListPageObject.getDepartment(0).click();
            DepartmentsListPageObject
              .getDepartmentUsersList(0)
              .find(('[data-testid="users-list-row"]'))
              .should('have.length', 2);
          });

          context('Users addition', () => {
            it('should add users ', () => {
              const newUserName = 'Test user';
              const newUserEmail = 'user@test.com';

              DepartmentsListPageObject.getDepartment(0).click();
              DepartmentsListPageObject.addUserToDepartment(0, newUserName, newUserEmail);
              DepartmentsListPageObject.getDepartment(0).click();

              DepartmentsListPageObject.getDepartmentUsers(0).should('have.length', 3);
              DepartmentsListPageObject.getDepartmentUsers(0).eq(2).get('[data-testid="user-name"]').should('include.text', newUserName);
              DepartmentsListPageObject.getDepartmentUsers(0).eq(2).get('[data-testid="user-email"]').should('include.text', newUserEmail);
            });

            it('should prefill and disable the department when adding a new user', () => {
              DepartmentsListPageObject.getDepartment(0).click();
              DepartmentsListPageObject.addUserToDepartment(0);

              cy.get('[data-testid="user-form-department"] .p-dropdown').should('have.class', 'p-disabled');
              cy.get('[data-testid="user-form-department"] .p-dropdown').should('include.text', 'Marketing');
            });
          });

          context('Users Edition', () => {
            it('should edit users', () => {
              const newUserName = 'Test user';
              const newUserEmail = 'user@test.com';

              DepartmentsListPageObject.getDepartment(0).click();
              DepartmentsListPageObject.editDepartmentUser(0, 0, newUserName, newUserEmail);             

              DepartmentsListPageObject.getDepartment(0).click();
              DepartmentsListPageObject.getDepartmentUser(0, 0).find('[data-testid="user-name"]').should('include.text', newUserName);
              DepartmentsListPageObject.getDepartmentUser(0, 0).find('[data-testid="user-email"]').should('include.text', newUserEmail);
            });

            it('should remove user from previous department when a new department is assigned', () => {
              DepartmentsListPageObject.getDepartment(0).click();
              // cy.get('[data-testid="users-list-edit-button"]').first().click();
              DepartmentsListPageObject.editDepartmentUser(0, 0);
              cy.get('[data-testid="user-form-department"]').click();
              cy.get('li[role="option"]').eq(1).click();
              cy.get('[data-testid="user-form-submit"]').click();

              DepartmentsListPageObject.getDepartment(0).click();

              DepartmentsListPageObject.getDepartmentUsers(0).should('have.length', 1);
              
              DepartmentsListPageObject.getDepartment(0).click();

              DepartmentsListPageObject.getDepartmentUsers(1).should('have.length', 3);
            });
          });

          context('Users Deletion', () => {
            it('should delete users ', () => {
              DepartmentsListPageObject.getDepartment(0).click();

              DepartmentsListPageObject.deleteDepartmentUser(0, 0);

              DepartmentsListPageObject.getDepartmentUsers(0).should('have.length', 1);
            });
          });  
        });
      });
    });
  });
});
