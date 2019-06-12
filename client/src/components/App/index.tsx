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
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState();

  const { getFieldDecorator } = props.form;
  const { Title } = Typography;

  useEffect(() => {}, [visible]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, { email }) => {
      const getEmailRes = await getEmail(email);
      console.log(getEmailRes);
      if (getEmailRes.data.amount) {
        setBalance(getEmailRes.data.amount);
        setVisible(true);
        setEmail(email);
      }
    });
  };

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
      <Suspense fallback={<div>...</div>}>
        {
          // @ts-ignore
          <PaymentModal
            onCancel={onCancel}
            email={email}
            visible={visible}
            balance={balance}
          />
        }
      </Suspense>
    </AppWrapper>
  );
};

const WrappedApp = Form.create({ name: 'form' })(App);

export default WrappedApp;
