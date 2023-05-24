# departments

This lib contains the functionality related to the management of the departments.

## Original Requirements
▪ The application should display a list of departments that includes the department name and a list of users in that department.
▪ The application should allow us to add, edit, and delete departments.
▪ The application should allow us to add, edit, and delete users within a department.
▪ A department can have zero or several users. This means that a department can be created and exist without any users being associated with it, or it can have many users associated with it.
▪ A user can only belong to one department. This means that when a user is created or edited, they must be associated with a single department, and cannot be associated with more than one department at the same time.
▪ During the creation of a user, the department is prefilled and disabled (it is assumed that the department has already been selected). This is done to prevent users from accidentally or intentionally associating users with the wrong department.
▪ During the editing of a user, it may be necessary to change their department.

## Running unit tests

Run `nx test departments` to execute the unit tests.
