package com.qq.server.model;

import java.net.*;
import java.io.*;
import com.qq.common.*;
import com.qq.server.tools.ManageServerConClientThread;
import com.qq.server.tools.ServerConnectClientThread;
import com.qq.server.db.DBSUID;

/**
 * qq�������������ȴ��ͻ��˵�����
 */
public class MyQQServer implements java.io.Serializable{

	public MyQQServer(){
		try {
			//����������������
			System.out.println("���Ƿ�����,����8080����");
			ServerSocket sc = new ServerSocket(8080);
			while(true){
				//�����ȴ�����
				Socket s = sc.accept();

				//��������
				ObjectInputStream ois = new ObjectInputStream(s.getInputStream());
				User u = (User)ois.readObject();//�õ�U��ȥ���ݿ���֤,������֤�Ľ�����ز�ͬ��messagetype

				Message ms = new Message();

				//����֤������Ϣ����
				ObjectOutputStream oos = new ObjectOutputStream(s.getOutputStream());

				switch (u.getIfNew()) {
					case 1://��ʾ��ע���
						//�ж�QQ�����Ƿ��Ѿ�����
		 				if(DBSUID.zhuCe(u.getUserId(),u.getPasswd())){
		 					//qq�����Ѿ�ע��ɹ�
		 					ms.setMesType("6");
							oos.writeObject(ms);
							s.close();
						}else{
							//qq����ע��ʧ��
							ms.setMesType("7");
							oos.writeObject(ms);
							//�ر�����
							s.close();
						}
						break;
					case 2: //��ʾ����½��
						//�ж�QQ�����Ƿ���ȷ
		 				if(DBSUID.dengLu(u.getUserId(),u.getPasswd())){//�ȼ����� �򵥵Ĺ����ǣ����������123456����Ϊ�ɹ�
							ms.setMesType("1");
							oos.writeObject(ms);

							//�ɹ���¼�󣬷�����Ϊ�ͻ��˵���һ���߳�������ÿͻ��˵�ͨѶ
							ServerConnectClientThread scct = new ServerConnectClientThread(s);

							//���¿����̼߳��뵽 hashmap
							ManageServerConClientThread.addClientThread(u.getUserId(), scct);

							//����ͨѶ�߳�
							scct.start();

							//��֪ͨ���������û�˵��������
							scct.NoticeOther(u.getUserId());
						}else{
							ms.setMesType("2");
							oos.writeObject(ms);
							//������󣬹ر�����
							s.close();
						}
		 				break;
					case 11:
						break;
					case 12:
						break;
					default:
						break;
				}


			}

		} catch (Exception e) {
			e.printStackTrace();//��ӡ���쳣
		}
	}


	
}
