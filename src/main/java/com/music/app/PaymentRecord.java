package com.music.app;

import java.util.Date;

public class PaymentRecord {

    private int id;
    private int userId;
    private Date paymentDate;
    private String status;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "PaymentRecord{" +
                "id=" + id +
                ", userId=" + userId +
                ", paymentDate=" + paymentDate +
                ", status='" + status + '\'' +
                '}';
    }
}
