/================================================
//==> Nombre del programa: Suma de dos número
//==> Archivo : QuinonezAlisson-SumaN.cpp
//==>Autor: Alisson Quñonez
//==>Fecha de elaboración:2022-04-29
//==>Fecha ultima actualización:2022-05-20
//=================================================
#include<iostream>
using namespace std;
int main ()
{
	float ac_x,ac_c=0,ac_a=0,ac_N;
	cout<<"ingrese la catidad de numeros que vas a sumar:"; cin>>ac_N;
do{ 
	cout<<"ingrese el numero :"; cin>>ac_x;
		ac_c=ac_c+1;
		ac_a=ac_a+ac_x;
	}while(ac_c<ac_N);

	cout<<"suma total:"<<ac_a;

	return 0;
	
  }