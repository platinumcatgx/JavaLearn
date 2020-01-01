package com.qq.server.tools;

import com.qq.common.Message;
import com.qq.server.db.DBSUID;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class MessageTools {

    /**
     * ����Ϊ�û�3���ڵ���Ϣ,����Ϣ��Ϣ�����ݿ���ȡ��
     * @param m
     * @return
     */
    public ArrayList<Message> toFile(Message m){
        ResultSet rs = DBSUID.exeSelect("select * from lt where " +
                " m_id=? and f_id=? or" +
                " f_id=? and m_id=? and" +
                " time between ? and ? ", m.getSender(), m.getGetter(), m.getSender(), m.getGetter(),System.currentTimeMillis()-3*24*60*60*1000,System.currentTimeMillis());
        ArrayList<Message> arrayList = null;
        try {
            while (rs.next()){
                Message ms = new Message();
                ms.setSender(rs.getString("m_id"));
                ms.setGetter(rs.getString("f_id"));
                ms.setCon(rs.getString("data"));
                ms.setSendTime(rs.getString("time"));
                arrayList.add(ms);
            }
            return arrayList;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
