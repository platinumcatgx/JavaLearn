/*
 * �û���Ϣ��
 */
package com.qq.common;

public class User implements java.io.Serializable{
	private String userId;
	private String passwd;
	private int IfNew;//������ʶ����û��Ƿ������û��������ע��ҳ���user����Ϊ1��ʾ���û�������ǵ�¼ҳ���user����Ϊ2��ʾ�Ѵ����û�
	
	public int getIfNew() {
		return IfNew;
	}
	public void setIfNew(int ifNew) {
		IfNew = ifNew;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPasswd() {
		return passwd;
	}
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	
	
}
