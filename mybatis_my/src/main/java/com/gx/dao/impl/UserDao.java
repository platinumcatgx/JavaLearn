package com.gx.dao.impl;

import com.gx.dao.IUserDao;
import com.gx.domain.User;
import mybatis.sqlSession.SqlSession;
import mybatis.sqlSession.SqlSessionFactory;


import java.util.List;

public class UserDao implements IUserDao {
    private SqlSessionFactory factory;
    public UserDao(SqlSessionFactory factory) {
        this.factory = factory;
    }

    public List<User> findAll() {
        SqlSession sqlSession = factory.openSession();
        List<User> list = sqlSession.selectList("com.gx.dao.IUserDao.findAll");
        sqlSession.close();
        return list;
    }
}