INSERT IGNORE INTO `role` (`createdAt`, `updatedAt`, `description`, `name`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', 'System administrator', 'admin');
INSERT IGNORE INTO `role` (`createdAt`, `updatedAt`, `description`, `name`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', 'Applicant user', 'applicant');
INSERT IGNORE INTO `role` (`createdAt`, `updatedAt`, `description`, `name`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', 'Job manager', 'job');

INSERT IGNORE INTO `users` (`createdAt`, `updatedAt`, `active`, `email`, `first_name`, `last_name`, `password`, `password_expired`, `username`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', TRUE, 'admin.admin@gmail.com', 'Admin', 'Admin', 'admin', FALSE, 'admin');
INSERT IGNORE INTO `users` (`createdAt`, `updatedAt`, `active`, `email`, `first_name`, `last_name`, `password`, `password_expired`, `username`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', TRUE, 'applicant.applicant@gmail.com', 'Applicant', 'Applicant', 'applicant', FALSE, 'applicant');
INSERT IGNORE INTO `users` (`createdAt`, `updatedAt`, `active`, `email`, `first_name`, `last_name`, `password`, `password_expired`, `username`) VALUES ('2020-01-09 15:41:00', '2020-01-09 15:41:00', TRUE, 'job.job@gmail.com', 'Job', 'Job', 'job', FALSE, 'job');

INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES ('1', '1');
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES ('2', '2');
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES ('3', '3');