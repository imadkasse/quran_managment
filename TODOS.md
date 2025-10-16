create tables

users => finish
students => finish
attendance => finish
evaluations => finish
subscriptions => finish
notifications => finish
reports => finish


العلاقات

User (Parent) → Students (ولي له عدة طلاب).

User (Teacher) → Students (معلم له عدة طلاب).

Student → Attendance, Evaluations, Subscriptions, Reports.

User → Notifications (لكل مستخدم إشعارات خاصة).


create RLS
 
for users => finish
for students => finish
for attendance => finish
for evaluations => finish
for subscriptions => finish
for notifications => finish
for reports => finish

ADD UI 

1: all pages inside /teahcer done
2: all pages inside /parent
3: all pages inside /admin 

1: start add logic to /teacher pages 

