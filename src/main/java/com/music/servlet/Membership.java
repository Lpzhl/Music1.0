package com.music.servlet;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.music.app.PaymentRecord;
import com.music.app.User;
import com.music.app.UserMembership;
import com.music.app.UserPost;
import com.music.dao.DatabaseConnection;
import com.music.mapper.*;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Date;


@WebServlet("/membership/*")
@MultipartConfig
public class Membership extends BaseServlet{
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private MembershipMapper membershipMapper;
    private SqlSessionFactory sqlSessionFactory;
    private SqlSession sqlSession;
    private UserMapper userMapper;


    public Membership() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
         sqlSession = sqlSessionFactory.openSession();  // 建立 session
         membershipMapper = sqlSession.getMapper(MembershipMapper.class);
         userMapper = sqlSession.getMapper(UserMapper.class);
    }
    @Override
    public void init() throws ServletException {
        super.init();
        try {
            ensureSqlSessionFactoryIsInitialized();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }
    }

    protected void checkmembershipGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int userId = loggedInUser.getId();

        // 获取当前用户的会员信息
        UserMembership userMembership = membershipMapper.getUserMembership(userId);

        // 获取当前日期
        Date currentDate = new Date();

        JsonObject json = new JsonObject();
        json.addProperty("success", false); // 默认设置为失败

        if (userMembership != null) {
            Date endDate = userMembership.getEnd_date();

            if (endDate != null && currentDate.after(endDate)) {
                // 会员已过期，更新用户数据库表的 is_member 字段，并返回更新后的用户信息
                boolean updated = membershipMapper.updateUserMembershipStatus(userId, false);

                if (updated) {
                    json.addProperty("success", true); // 更新成功
                    loggedInUser.setIs_member(false);

                    // 获取更新后的用户信息
                    User updatedUser = membershipMapper.getUserWithMembership(userId);

                    // 示例：将用户信息转换为 JSON 字符串并发送到前端
                    Gson gson = new Gson();
                    String updatedUserJson = gson.toJson(updatedUser);
                    json.addProperty("updatedUser", updatedUserJson);
                }
            }
        }

        response.getWriter().write(json.toString());
    }



    protected void buysuccessPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            // 使用Jackson解析请求体中的JSON
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(request.getInputStream());
            int userId = rootNode.path("user_id").asInt();
            // 在 payment_records 插入一条记录
            PaymentRecord newRecord = new PaymentRecord();
            newRecord.setUserId(userId);
            newRecord.setPaymentDate(new Date());
            newRecord.setStatus("SUCCESS");
            membershipMapper.insertPaymentRecord(newRecord);

            System.out.println("userId:"+userId);
            // 检查 user_membership 中是否有会员记录
            UserMembership membership = membershipMapper.getMembershipByUserId(userId);
            System.out.println("membership:"+membership);
            if (membership == null) {
                // 如果没有，添加一个新的会员记录
                Date startDate = new Date();
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.DATE, 7);  // 加7天
                Date endDate = calendar.getTime();

                UserMembership newUserMembership = new UserMembership();
                newUserMembership.setUser_Id(userId);
                newUserMembership.setStart_date(startDate);
                newUserMembership.setEnd_date(endDate);

                membershipMapper.insertMembership(newUserMembership);
                sqlSession.commit();
            } else {
                // 如果已经是会员，更新结束日期
                Date currentEndDate = membership.getEnd_date();
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(currentEndDate);
                calendar.add(Calendar.DATE, 7);  // 加7天

                membership.setEnd_date(calendar.getTime());
                membershipMapper.updateMembership(membership);
                sqlSession.commit();
            }

            // 更新 users 表
            User user = membershipMapper.getUserById(userId);
            user.setIs_member(true);
            membershipMapper.updateUser(user);

            // 提交事务
            sqlSession.commit();

            // 向前端发送用户信息
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new Gson().toJson(user));  // 使用Gson库将对象转换为JSON
        } catch (Exception e) {
            // 如果发生异常，回滚事务
            sqlSession.rollback();
            throw e;
        }
    }
}
