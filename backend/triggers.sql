DELIMITER //

CREATE TRIGGER after_task_insert
AFTER INSERT ON tasks
FOR EACH ROW
BEGIN
  INSERT INTO notifications (user_id, task_id, title, message, type)
  VALUES (NEW.assigned_employee_id, NEW.id, 'Task Assigned', 'You have been assigned a new task.', 'TASK_ASSIGNED');
END //

CREATE TRIGGER after_task_update
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
  IF OLD.status != 'COMPLETED' AND NEW.status = 'COMPLETED' THEN
    INSERT INTO notifications (user_id, task_id, title, message, type)
    VALUES (NEW.assigned_employee_id, NEW.id, 'Task Completed', 'Task has been completed successfully.', 'TASK_COMPLETED');
  END IF;
END //

DELIMITER ;
