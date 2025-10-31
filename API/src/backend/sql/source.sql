USE q_a_db;

DROP TABLE IF EXISTS `post_category`;

DROP TABLE IF EXISTS `likes`;

DROP TABLE IF EXISTS `comments`;

DROP TABLE IF EXISTS `posts`;

DROP TABLE IF EXISTS `category`;

DROP TABLE IF EXISTS `users`;


CREATE TABLE `users`
(
    id              INT AUTO_INCREMENT NOT NULL UNIQUE,
    login           VARCHAR(32)        NOT NULL UNIQUE,
    password        VARCHAR(64)        NOT NULL,
    email           VARCHAR(64)        NOT NULL UNIQUE,
    full_name       VARCHAR(128)           DEFAULT 'NoName',
    role            ENUM ('user', 'admin') DEFAULT 'user',
    rating          INT                    DEFAULT 0,
    profile_picture VARCHAR(128)
);

INSERT INTO `users` (login, password, email, full_name, `role`)
VALUES ("first_admin", "$2b$05$dkwQFS/dSCR2fbccxVJjhewr6Jwo0hwOAhT1ENjeYIQUlz1wvbR9u", "admin", "admin", "admin");

CREATE TABLE `category`
(
    id          INT AUTO_INCREMENT NOT NULL UNIQUE,
    title       VARCHAR(256)       NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE `posts`
(
    id           INT AUTO_INCREMENT NOT NULL UNIQUE,
    author       INT,
    title        VARCHAR(256)       NOT NULL,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status       BOOL     DEFAULT TRUE,
    content      TEXT(1028)               NOT NULL,
    category     INT,
    FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `post_category`
(
    post_id     INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
);

CREATE TABLE `comments`
(
    id           INT AUTO_INCREMENT NOT NULL UNIQUE,
    author       INT,
    post_id      INT,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content      TEXT               NOT NULL,
    status       BOOL     DEFAULT TRUE,
    FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES `posts` (id) ON DELETE CASCADE
);

CREATE TABLE `likes`
(
    author       INT,
    post_id      INT,
    comment_id   INT,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type         BOOL,
    FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES `posts` (id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES `comments` (id) ON DELETE CASCADE
);



