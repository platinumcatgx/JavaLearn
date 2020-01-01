package com.qq.server.db;

import com.qq.common.Message;

import java.sql.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;


/**
 * ClassName: Operation
 * @Description: �����ݿ������ز���
 * @author Emma56
 */
public class DBSUID {
    private static Connection Conn;//���ݿ����Ӷ���
    private static String URL = "jdbc:mysql:///jstx";// ���ӵ����ݿ��ַ
    private static String UserName = "root";
    private static String Password = "123456";

    public static Connection getConn(){
        try {
//            Class.forName("com.mysql.jdbc.Driver");//��������
            Conn=DriverManager.getConnection(URL, UserName, Password);//�������ݿ�
            return Conn;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     *���ݿ��ͨ�� �� ɾ ��
     * @param sql
     * @param param
     * @return
     */
    public static boolean exeUpdate(String sql,Object ...param){
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = getConn();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < param.length; i++) {
                ps.setObject(i + 1, param[i]);
            }
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally{
            try {
                if(ps != null){
                    ps.close();
                }
                if(conn != null){
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    /**
     * ���ݿ��ͨ�� ��ѯ
     * @param sql
     * @param param
     * @return
     */
    public static ResultSet exeSelect(String sql,Object... param){
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = getConn();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < param.length; i++) {
                ps.setObject(i + 1, param[i]);
            }
            return ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally{

        }
        return null;
    }

    /**
     * ע��
     * @param id
     * @param psw
     * @return
     */
    public static boolean zhuCe(String id ,String psw){
        ResultSet r = DBSUID.exeSelect("select * from user where id=? ", id);
        if (r==null){//�޸�ID
            //ע��
            return DBSUID.exeUpdate("insert into user values(null,?,?)",id,psw);
        }else {//�˺��Ѵ�
            return false;
        }
    }

    /**
     * ��¼
     * @param id
     * @param psw
     * @return
     */
    public static boolean dengLu(String id ,String psw){
        ResultSet r = DBSUID.exeSelect("select * from user where id=? and password=? ", id,psw);
        if (r==null){//�˺Ż��������
            //ע��
            return false;
        }else {//�˺��Ѵ�
            return true;
        }
    }


    /**
     * ����Ϣ��ӵ����ݿ�
     * @param ms ��Ϣ����
     * @return
     */
    public static boolean addMassage(Message ms){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//�������ڸ�ʽ
        String time = df.format(new Date(System.currentTimeMillis()));
        return DBSUID.exeUpdate("insert into lt values(null,?,?,?,?);",ms.getSender(),ms.getGetter(),ms.getCon(),time);//�洢��Ϣ������
    }


}

