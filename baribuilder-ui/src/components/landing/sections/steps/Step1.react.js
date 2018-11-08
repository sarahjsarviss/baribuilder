import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React, {Fragment} from 'react';
import styled from 'styled-components';
import Sketch from '../../../../app/style/SketchVariables';
import images from '../../../../constants/images';
import {CenteredTextGrid, EmptyRow} from '../../../style/Layout';
import {Body, Header2} from '../../../style/Typography';
import OptionPill from './OptionPill.react';
import StepOval from './StepOval.react';

const LeftAlignHeader2 = styled(Header2)`
  text-align: left;
`;

const CenteredBody = styled(Body)`
  text-align: center;
`;

const FullWidthImg = styled.img`
  width: 100%;
`;

const instructionCopy = 'Fill out the dosages your body needs.';
const subInstructionCopy = 'Get these from one of:';
const optionsCopy = [
  'Your medical provider',
  'Your own online research',
  'Our surgery-specific templates',
];

// Desktop vs. tablet/mobile arrangements are very different
const Step1 = () => (
  <Fragment>
    {/* Mobile & Tablet */}
    <Hidden lgUp>
      <Hidden only='xs'>
        <Grid item sm={1}/>
      </Hidden>
      <Grid item xs={12} sm={10} container>
        <Grid item xs={2}>
          <StepOval value='1'/>
        </Grid>
        <Grid item xs={9}>
          <LeftAlignHeader2 dark>{instructionCopy}</LeftAlignHeader2>
        </Grid>
        <Grid item xs={1}/>
      </Grid>
      <Hidden only='xs'>
        <Grid item sm={1}/>
      </Hidden>
      <EmptyRow mobile='5px'/>
      <Hidden only='xs'>
        <Grid item sm={1}/>
      </Hidden>
      <Grid item xs={12} sm={10}>
        <FullWidthImg
          src={images.step1.original}
          srcSet={`${images.step1.mobile} 360w,
                   ${images.step1.tablet} 600w`}
          sizes={`(min-width: ${Sketch.breakpoints.tablet}px) 600px, 360px`}
          alt='Step 1: Enter Your Desired Dosages Image'
        />
      </Grid>
      <Hidden only='xs'>
        <Grid item sm={1}/>
      </Hidden>
      <Fragment>
        <Grid item xs={1} sm={2}/>
        <Grid item xs={10} sm={8} container justify='center'>
          <EmptyRow mobile='10px'/>
          <CenteredTextGrid item lg={12}>
            <CenteredBody dark>{subInstructionCopy}</CenteredBody>
          </CenteredTextGrid>
          <Grid item xs={12}>
            <OptionPill value={optionsCopy[0]}/>
            <OptionPill value={optionsCopy[1]}/>
            <OptionPill value={optionsCopy[2]}/>
          </Grid>
        </Grid>
        <Grid item xs={1} sm={2}/>
      </Fragment>
    </Hidden>
    {/* Desktop */}
    <Hidden mdDown>
      <Grid item lg={1}/>
      <Grid item lg={1} container>
        <Grid item lg={12}>
          <StepOval value='1'/>
        </Grid>
      </Grid>
      <Grid item lg={4} container>
        <Grid item lg={12}>
          <LeftAlignHeader2 dark>{instructionCopy}</LeftAlignHeader2>
        </Grid>
        <EmptyRow desktop='20px'/>
        <CenteredTextGrid item lg={12}>
          <CenteredBody dark>{subInstructionCopy}</CenteredBody>
          <OptionPill value={optionsCopy[0]}/>
          <OptionPill value={optionsCopy[1]}/>
          <OptionPill value={optionsCopy[2]}/>
        </CenteredTextGrid>
      </Grid>
      <Grid item lg={1}/>
      <Grid item lg={4}>
        <FullWidthImg
          src={images.step1.tablet}
          alt='Step 1: Enter Your Desired Dosages Image'
        />
      </Grid>
      <Grid item lg={1}/>
    </Hidden>
  </Fragment>
);

export default Step1;