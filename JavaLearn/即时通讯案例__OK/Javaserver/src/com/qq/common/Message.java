package com.qq.common;

import java.util.Date;

public class Message implements java.io.Serializable{
	private String mesType;//messageType��Ϣ������
	
	private String sender;//���ͷ�
	private String getter;//���շ�
	
	private String con;//��Ϣ����	
	private String sendTime;//����ʱ��
	private Date time;

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getMesType() {
		return mesType;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getGetter() {
		return getter;
	}

	public void setGetter(String getter) {
		this.getter = getter;
	}

	public String getCon() {
		return con;
	}

	public void setCon(String con) {
		this.con = con;
	}

	public String getSendTime() {
		return sendTime;
	}

	public void setSendTime(String sendTime) {
		this.sendTime = sendTime;
	}

	public void setMesType(String mesType) {
		this.mesType = mesType;
	}
	
}
