package com.music.dao;

import com.music.app.User;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DatabaseConnection {

    // 资源配置
    private String dbUrl = "jdbc:mysql://localhost:3306/music";
    private String dbUname = "root";
    private String dbPassword = "123456";
    private String dbDriver = "com.mysql.cj.jdbc.Driver";

    // 加载驱动程序
    public void loadDriver(String dbDriver) {
        try {
            Class.forName(dbDriver);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // 连接数据库
    public Connection getConnection() {
        Connection con = null;
        try {
            con = DriverManager.getConnection(dbUrl, dbUname, dbPassword);
            System.out.println("数据库连接成功");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return con;
    }



    // 验证登录
    public User validate(User user) {
        User result = null;
        // check if the user is null before proceeding
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        loadDriver(dbDriver);
        Connection con = getConnection();

        if (con != null) {
            String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
            PreparedStatement ps = null;
            ResultSet rs = null;

            try {
                ps = con.prepareStatement(sql);
                ps.setString(1, user.getUsername());
                ps.setString(2, hashWithMD5(user.getPassword()));
                rs = ps.executeQuery();

                if (rs.next()) {
                    result = new User();
                    result.setId(rs.getInt("id"));
                    result.setUsername(rs.getString("username"));
                    result.setPassword(rs.getString("password"));
                    result.setEmail(rs.getString("email"));
                    result.setNickname(rs.getString("nickname"));
                    result.setAvatar(rs.getString("avatar"));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (rs != null) {
                        rs.close();
                    }
                    if (ps != null) {
                        ps.close();
                    }
                    con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }

    // 注册
    public void save(User user) {
        loadDriver(dbDriver);
        Connection con = getConnection();
        String sql = "INSERT INTO users(username, password, email,nickname,avatar) VALUES(?, ?, ?,?,?)";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getNickname());
            ps.setString(5, user.getAvatar());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 用户名查重
    public boolean existsByUsername(String username) {
        loadDriver(dbDriver);
        Connection con = getConnection();
        String sql = "SELECT 1 FROM users WHERE username = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    // 邮箱查重
    public boolean existsByEmail(String email) {
        loadDriver(dbDriver);
        Connection con = getConnection();
        String sql = "SELECT 1 FROM users WHERE email = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    // 找回密码
// 更新密码
    public void updatePassword(String email, String newPassword) {
        loadDriver(dbDriver);
        Connection con = getConnection();
        String sql = "UPDATE users SET password = ? WHERE email = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, newPassword);
            ps.setString(2, email);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    // 根据邮箱查找用户
    public User findByEmail(String email) {
        loadDriver(dbDriver);
        Connection con = getConnection();
        String sql = "SELECT * FROM users WHERE email = ?";
        User user = null;
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setAvatar(rs.getString("avatar"));
                user.setNickname(rs.getString("nickname"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    private String hashWithMD5(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(password.getBytes());
            BigInteger no = new BigInteger(1, digest);
            String hashText = no.toString(16);
            while (hashText.length() < 32) {
                hashText = "0" + hashText;
            }
            return hashText;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
