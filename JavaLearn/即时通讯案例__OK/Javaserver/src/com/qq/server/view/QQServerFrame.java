/*
 * �������˵Ŀ��ƽ��棬
 * 1.��������������
 * 2.�رշ�����
 * 3.����ͼ���û� 
 */
package com.qq.server.view;

import javax.swing.*;

import com.qq.server.model.MyQQServer;

import java.awt.*;
import java.awt.event.*;

public class QQServerFrame extends JFrame implements ActionListener{
	JPanel jp1;
	JButton jb1, jb2;
	
	public static void main(String[] args) {
		QQServerFrame myserver = new QQServerFrame();
	}
	
	/**
	 * �������Ľ���
	 */
	public QQServerFrame()
	{
		jp1 = new JPanel();
		jb1 = new JButton("����������");
		jb1.addActionListener(this);
		jb2 = new JButton("�رշ�����");
		jp1.add(jb1);
		jp1.add(jb2);
		
		this.add(jp1);
		this.setSize(500,100);
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setVisible(true);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getSource()==jb1){//��ȡ��Դ
			new MyQQServer();
		}
	}

}
