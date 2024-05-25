'use client';

import CompanySubmitRequest from "@/components/company-submit-request";
import FloatingConnect from "@/components/floating-connect";

const SubmitRequestPage: React.FC = () => {
    return (
        <main>
      <FloatingConnect />
      <CompanySubmitRequest loading verificationMessage="" onClickSubmitRequest={
        () => {
          console.log("Submit request");
        }
      }/>
    </main>
    );
}

export default SubmitRequestPage;