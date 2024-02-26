import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ColorSelector } from './ColorSelector';
import { Suspense } from 'react';
import '../../css/options.css';
import { RecoilRoot } from 'recoil';
import Spinner from 'react-bootstrap/Spinner';
import { FontSizeSelector } from './FontSizeSelector';

export const OptionsApp = () => (
  <RecoilRoot>
    <div className="root">
      <Container fluid>
        <Row>
          <Col>
            <h1>Kemonova+ オプション</h1>
            <p>反映にはページのリロードが必要です</p>
            <h2>テーマ色</h2>
            <Suspense fallback={<Spinner />}>
              <ColorSelector />
            </Suspense>
            <h2>フォントサイズ</h2>
            <Suspense fallback={<Spinner />}>
              <FontSizeSelector />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </div>
  </RecoilRoot>
);
