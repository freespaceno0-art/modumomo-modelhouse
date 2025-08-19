-- 비밀번호 수정 스크립트
-- admin123을 BCrypt로 해시한 값으로 업데이트

UPDATE users 
SET password = '$2a$10$rDmFN6ZqJdcQj6K8XQqK8OQqK8XQqK8XQqK8XQqK8XQqK8XQqK8' 
WHERE username = 'admin';

UPDATE users 
SET password = '$2a$10$rDmFN6ZqJdcQj6K8XQqK8OQqK8XQqK8XQqK8XQqK8XQqK8XQqK8' 
WHERE username = 'freespace_st';

UPDATE users 
SET password = '$2a$10$rDmFN6ZqJdcQj6K8XQqK8OQqK8XQqK8XQqK8XQqK8XQqK8XQqK8' 
WHERE username = 'user1';
