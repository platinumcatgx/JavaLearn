/*
 * 定义包的种类
 */
package com.qq.common;

public interface MessageType {
	String message_success = "1";//��½�ɹ�
	String message_login_fail = "2";//��½ʧ��
	String message_common_message = "3";//��ͨ���ݰ�
	String message_get_OnlineFriend = "4";//�������ߺ���
	String message_receive_OnlineFriend = "5";//�������ߺ���
	String message_receive_QQNumNoExist = "6";//ע��QQ����ɹ�
	String message_receive_QQNumYesExist = "7";//ע��QQ����ʧ��
}
