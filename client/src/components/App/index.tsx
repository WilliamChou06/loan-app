import React, { useState, useEffect, Suspense, lazy } from 'react';
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

const PaymentModal = lazy(() => import('../PaymentModal'));

interface Props {
  form: any;
}

const App: React.FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState();
  const [error, setError] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, { email }) => {
      const getEmailRes = await getEmail(email);
      if (getEmailRes.data.amount) {
        setVisible(true);
        setEmail(email);
        setError('');
      } else {
        setError('User not found or does not have any debts');
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
    setVisible(false);
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
