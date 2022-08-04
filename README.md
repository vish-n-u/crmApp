# crmApp is a new Project made on nodejs using express and MongoDB.
New Users are allowed to register,existing users can login / update their userDetails based on their authorization/role.
Its main features being providing authentication and authorization to users and allowing them to file new complaints as well as keeping track of the existing ones.
A notification will be recieved after a Ticket is created/updated followed by an email sometime later.

// Assignment:-
Q1. assigning ticket to least busy engineer :- constants has a function to solve this which is called in tickets.controller
Q2 . Customer can update their name but not assign new engineer for ticket but if they provide an engineer that is already assigned to them , then there shouldnt 
be any 400 error :- ticket.middleware
Q3 . 
