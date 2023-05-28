export class DepartmentsListPageObject {
  static getDepartments() {
    return cy.get('[data-testid="department-list-department"]');
  }

  static getDepartment(index = 0) {
    return cy.get('[data-testid="department-list-department"]').eq(index);
  }

  static addDepartment(name: string) {
    cy.get('[data-testid="department-list-add-button"]').click();
    cy.get('[data-testid="department-form-name"]').type(name);
    cy.get('[data-testid="department-form-submit"]').click();
  }

  static editDepartment(index = 0, name: string) {
    this.getDepartment(index)
      .find('[data-testid="department-list-edit-button"]')
      .click();
    cy.get('[data-testid="department-form-name"]').clear();
    cy.get('[data-testid="department-form-name"]').type(name);
    cy.get('[data-testid="department-form-submit"]').click();
  }

  static deleteDepartment(index = 0) {
    this.getDepartment(index)
      .find('[data-testid="department-list-delete-button"]')
      .click();
  }

  static getDepartmentUsersList(departmentIndex = 0) {
    return this.getDepartment(departmentIndex)
      .find('[data-testid="department-list-users-list"]');
  }

  static addUserToDepartment(departmentIndex = 0, newUserName?: string, newUserEmail?: string) {
    this.getDepartment(departmentIndex)
      .find('[data-testid="users-list-user-add-button"]')
      .click();

    if (newUserName && newUserEmail) {
      cy.get('[data-testid="user-form-name"]').type(newUserName);
      cy.get('[data-testid="user-form-email"]').type(newUserEmail);
      cy.get('[data-testid="user-form-submit"]').click();
    }
  }

  static getDepartmentUsers(departmentIndex = 0) {
    return this.getDepartment(departmentIndex)
      .find('[data-testid="users-list-row"]');
  }

  static getDepartmentUser(departmentIndex = 0, userIndex = 0) {
    return this.getDepartment(departmentIndex)
      .find('[data-testid="users-list-row"]')
      .eq(userIndex);
  }

  static editDepartmentUser(departmentIndex = 0, userIndex = 0, newUserName?: string, newUserEmail?: string) {
    this.getDepartment(departmentIndex)
      .find('[data-testid="users-list-row"]')
      .eq(userIndex)
      .find('[data-testid="users-list-edit-button"]')      
      .click();

    if (newUserName && newUserEmail) {
      cy.get('[data-testid="user-form-name"]').type(newUserName);
      cy.get('[data-testid="user-form-email"]').type(newUserEmail);
      cy.get('[data-testid="user-form-submit"]').click();
    }
  }

  static deleteDepartmentUser(departmentIndex = 0, userIndex = 0) {
    this.getDepartment(departmentIndex)
      .find('[data-testid="users-list-row"]')
      .eq(userIndex)
      .find('[data-testid="users-list-delete-button"]')
      .click();
  }
}