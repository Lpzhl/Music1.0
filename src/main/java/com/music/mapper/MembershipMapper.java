package com.music.mapper;

import com.music.app.PaymentRecord;
import com.music.app.User;
import com.music.app.UserMembership;

public interface MembershipMapper {
    // 插入支付记录
    int insertPaymentRecord(PaymentRecord record);

    // 根据用户ID获取会员信息
    UserMembership getMembershipByUserId(int userId);

    // 插入新的会员记录
    int insertMembership(UserMembership membership);

    // 更新会员信息
    int updateMembership(UserMembership membership);

    // 获取用户信息
    User getUserById(int userId);

    // 更新用户信息
    int updateUser(User user);

    boolean updateUserMembershipStatus(int userId, boolean b);
    // 获取当前用户的会员信息
    UserMembership getUserMembership(int userId);

    // 获取更新后的用户信息
    User getUserWithMembership(int userId);


    // 升级歌曲为会员歌曲
    int upgradeToMemberSong(int songId);

    // 降级歌曲为普通歌曲
    int tierDownSong(int songId);

}
