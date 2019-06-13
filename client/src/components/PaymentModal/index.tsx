import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import { FormComponentProps } from 'antd/lib/form';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import 'antd/lib/typography/style/css';

import 'antd/lib/form/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/input/style/css';

interface Props extends FormComponentProps {
  visible: boolean;
  email: string;
  onCancel(): any;
  getBalance(email: string): any;
}

const PaymentModal: React.FC<Props> = ({
  email,
  visible,
  onCancel,
  form,
  getBalance,
}) => {
  const [balance, setBalance] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    // Fetch balance on every payment
    fetchBalance();
  }, [balance]);

  // Fetch balance and update local state
  const fetchBalance = async (): Promise<any> => {
    const res = await getBalance(email);
    setBalance(res.data.amount);
  };

  const handlePayment = async (e): Promise<any> => {
    e.preventDefault();
    form.validateFields(async (err, { amount }: { amount: number }) => {
      setError('');
      try {
        // Process payment and set balance
        const payDebtRes = await payDebt(amount);
        form.resetFields();
        setBalance(payDebtRes.data[email]);
      } catch (err) {
        console.log(err.response);
        setError('Your payment is larger than your debt!');
      }
    });
  };

  const payDebt = (amount: number): Promise<any> => {
    // Post request to pay amount
    return axios.post('/payments', {
      email,
      amount,
    });
  };

  const { getFieldDecorator } = form;
  const { Title, Text } = Typography;

  return (
    <Modal
      okText="Pay amount"
      visible={visible}
      onCancel={onCancel}
      onOk={handlePayment}
    >
      <Form>
        <h1>Debt: ${balance}</h1>
        {error && <Text type="danger">{error}</Text>}
        <br />
        <Form.Item>
          {getFieldDecorator('amount')(<Input placeholder="Amount" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const WrappedPaymentModal = Form.create<Props>({
  name: 'payment_modal',
})(PaymentModal);

export default memo(WrappedPaymentModal);
