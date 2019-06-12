import React, { useRef } from 'react';
import axios from 'axios';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style/css';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';

interface Props {
  visible: boolean;
  email: string;
  balance: number;
  onCancel(): any;
  getFieldDecorator: any;
}

const PaymentModal: React.FC<Props> = ({
  email,
  balance,
  visible,
  onCancel,
  getFieldDecorator,
}) => {
  const modalRef = useRef(null);

  const handlePayment = async e => {
    // @ts-ignore
    const form = modalRef.current.props.form;
    e.preventDefault();
    console.log(modalRef);
    // form.validateFields(async (err, { amount }) => {
    //   const payDebtRes = await payDebt(amount);
    //   console.log(payDebtRes);
    // });
  };

  const payDebt = async amount => {
    try {
      return await axios.post('/payments', {
        email,
        amount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      okText="Pay amount"
      ref={modalRef}
      visible={visible}
      onCancel={onCancel}
      onOk={handlePayment}
    >
      <Form onSubmit={handlePayment}>
        <p>Debt: ${balance}</p>
        {/* <Form.Item>
          {getFieldDecorator('amount')(<Input placeholder="Amount" />)}
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

const WrappedPaymentModal = Form.create({ name: 'payment_modal' })(
  PaymentModal
);

export default WrappedPaymentModal;
