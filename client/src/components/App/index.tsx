import React, { useState, useEffect, Suspense, lazy, useReducer } from 'react';
import axios from 'axios';
import { AppWrapper, InputContainer } from './style';

// antd imports
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/typography/style/css';
import { string } from 'prop-types';

const PaymentModal = lazy(() => import('../PaymentModal'));

enum ActionType {
  SHOW_MODAL = 'SHOW_MODAL',
  SET_ERROR = 'SET_ERROR',
  HIDE_MODAL = 'HIDE_MODAL',
}

interface Props {
  form: any;
}

interface IState {
  visible: boolean;
  email: string;
  error: string;
}

interface IAction {
  type: ActionType;
  email?: string;
  error?: string;
}

const InitialState: IState = {
  visible: false,
  email: null,
  error: null,
};

const reducer: React.Reducer<IState, IAction> = (state, action) => {
  switch (action.type) {
    case ActionType.SHOW_MODAL:
      return {
        ...state,
        visible: true,
        email: action.email,
        error: '',
      };
    case ActionType.HIDE_MODAL:
      return {
        ...state,
        visible: false,
      };
    case ActionType.SET_ERROR: {
      return {
        ...state,
        error: action.error,
      };
    }
  }
};

const App: React.FC<Props> = props => {
  const [{ visible, email, error }, dispatch] = useReducer<
    React.Reducer<IState, IAction>
  >(reducer, InitialState);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, { email }) => {
      const getEmailRes = await getEmail(email);
      if (getEmailRes.data.amount) {
        dispatch({ type: ActionType.SHOW_MODAL, email });
      } else {
        dispatch({
          type: ActionType.SET_ERROR,
          error: 'User not found or does not have any debts',
        });
      }
    });
  };

  const { getFieldDecorator } = props.form;
  const { Title, Text } = Typography;

  const getEmail = async email => {
    try {
      return await axios.post('http://localhost:4000/information', {
        email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onCancel = () => {
    dispatch({ type: ActionType.HIDE_MODAL });
  };

  return (
    <AppWrapper>
      <InputContainer>
        <Form onSubmit={handleSubmit}>
          <Title>Enter your Email</Title>
          <Text type="danger">{error}</Text>
          <Form.Item>
            {getFieldDecorator('email')(<Input placeholder="Email" />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </InputContainer>
      <Suspense fallback={<div>Loading...</div>}>
        {visible ? (
          // @ts-ignore
          <PaymentModal
            getBalance={getEmail}
            onCancel={onCancel}
            email={email}
            visible={visible}
          />
        ) : null}
      </Suspense>
    </AppWrapper>
  );
};

const WrappedApp = Form.create({ name: 'form' })(App);

export default WrappedApp;
