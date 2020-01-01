package com.qq.server.tools;

import java.util.HashMap;
import java.util.Iterator;
/*
 * ����ͻ��˵�Socket
 */
public class ManageServerConClientThread {
	
	public static HashMap hm = new HashMap<String, ServerConnectClientThread>();//���ɾ�̬��

	/**
s	 * @param uid �û�ID
	 * @param sct �������ͻ�������
	 */
	public static void addClientThread(String uid , ServerConnectClientThread sct){
		hm.put(uid, sct);
	}

	/**
	 * ͨ���û�ID��ȡ����
	 * @param uid
	 * @return
	 */
	public static ServerConnectClientThread getClientThread(String uid){
		return (ServerConnectClientThread)hm.get(uid);
	}

	/**
	 * ����ID�Ӽ�����ɾ�������߳�
	 * @param userIDtr
	 */
	public static void remove(String userIDtr){
		hm.remove(userIDtr);
	}

	/**
	 * �������ߺ��ѵ����
	 * @return
	 */
	public static String GetOnlineUserId(){
		String res = "";
		//ʹ�õ�������ͨ���ո�������ߺ���
		Iterator it = hm.keySet().iterator();
		while(it.hasNext()){
			//����ʱ�ж϶�Ӧ���߳��Ƿ������������ɾ���ü�ֵ��--<��δʵ��>--����ͻ��˶������Ͽ����Ӻ�����Ϊ�仯����
			res +=it.next().toString()+" ";
		}
		return res;
		
	}
}
