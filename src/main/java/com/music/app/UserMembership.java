package com.music.app;

import java.util.Date;

public class UserMembership {
    private int user_Id;
    private Date start_date;
    private Date end_date;

    public int getUser_Id() {
        return user_Id;
    }

    public void setUser_Id(int user_Id) {
        this.user_Id = user_Id;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }


    @Override
    public String toString() {
        return "UserMembership{" +
                "user_Id=" + user_Id +
                ", start_date=" + start_date +
                ", end_date=" + end_date +
                '}';
    }
}
